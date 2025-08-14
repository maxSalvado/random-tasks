// src/app/core/http/retry.interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { TimeoutError, throwError, timer } from 'rxjs';
import { retry, timeout } from 'rxjs/operators';
import {
  RETRY_ENABLED,
  RETRY_MAX_ATTEMPTS,
  RETRY_BASE_DELAY_MS,
  RETRY_MAX_DELAY_MS,
  RETRY_NON_IDEMPOTENT,
  TIMEOUT_MS
} from './retry.tokens';

// Detect rxjs timeout errors
function isTimeoutError(err: unknown): boolean {
  return err instanceof TimeoutError || (typeof err === 'object' && err !== null && (err as any).name === 'TimeoutError');
}

// Detect network/CORS-like errors (browser reports as status 0)
function isNetworkOrCorsLike(err: unknown): boolean {
  return err instanceof HttpErrorResponse && err.status === 0;
}

function isRetryableHttpStatus(err: HttpErrorResponse): boolean {
  // 408 timeout; 429 rate-limit; 5xx server
  return err.status === 408 || err.status === 429 || (err.status >= 500 && err.status < 600);
}

function isRetryable(err: unknown): boolean {
  if (isTimeoutError(err)) return true;
  if (isNetworkOrCorsLike(err)) return true;
  if (err instanceof HttpErrorResponse) return isRetryableHttpStatus(err);
  return false;
}

// exponential backoff with jitter
function backoffMs(tryIndex: number, base: number, cap: number): number {
  const exp = Math.min(cap, base * Math.pow(2, tryIndex - 1));
  const jitter = Math.random() * exp * 0.3; // ~30% jitter
  return Math.floor(exp + jitter);
}

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  const enabled = req.context.get(RETRY_ENABLED);
  const max = req.context.get(RETRY_MAX_ATTEMPTS);
  const base = req.context.get(RETRY_BASE_DELAY_MS);
  const cap  = req.context.get(RETRY_MAX_DELAY_MS);
  const perAttemptTimeout = req.context.get(TIMEOUT_MS);

  const idempotent = ['GET', 'HEAD', 'OPTIONS'].includes(req.method);
  const allowNonIdempotent = req.context.get(RETRY_NON_IDEMPOTENT);

  return next(req).pipe(
    // Give EACH attempt its own timeout window (cold starts can be long)
    timeout({ first: perAttemptTimeout }),
    enabled
      ? retry({
          count: max,
          resetOnSuccess: true,
          delay: (error, retryCount) => {
            const canRetry =
              isRetryable(error) &&
              (idempotent || allowNonIdempotent) &&
              navigator.onLine !== false;

            if (!canRetry) {
              return throwError(() => error);
            }
            return timer(backoffMs(retryCount, base, cap));
          }
        })
      : (src) => src
  );
};
