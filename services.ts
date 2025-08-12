// src/app/core/http/api-client.ts
import {
  HttpClient,
  HttpContext,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';

// Provide this token in app.config.ts (or a feature module) to set your API base.
// Example:
//   providers: [{ provide: API_BASE_URL, useValue: environment.apiBaseUrl }]
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  factory: () => '',
});

type Primitive = string | number | boolean | Date;
type ParamValue = Primitive | Primitive[] | null | undefined;
type Params = Record<string, ParamValue>;

export interface RequestOptions {
  /** Query string params (arrays become repeated keys, Dates -> ISO) */
  params?: Params;
  /** Extra headers (merged with defaults) */
  headers?: Record<string, string> | HttpHeaders;
  /** Pass retry/timeout flags etc. via HttpContext tokens */
  context?: HttpContext;
  /** Forward cookies if needed */
  withCredentials?: boolean;
}

export interface WriteOptions extends RequestOptions {
  /** Some APIs accept query params even for POST/PUT/PATCH */
}

export interface DeleteOptions extends RequestOptions {
  /** DELETE-with-body, if your backend supports it */
  body?: unknown;
}

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private http = inject(HttpClient);
  private baseUrl = inject(API_BASE_URL);

  /** GET /resource */
  get<T>(path: string, opts: RequestOptions = {}) {
    const url = this.resolveUrl(path);
    return this.http.get<T>(url, this.toHttpOptions(opts));
  }

  /** POST /resource */
  post<T, B = unknown>(path: string, body: B, opts: WriteOptions = {}) {
    const url = this.resolveUrl(path);
    return this.http.post<T>(url, body, this.toHttpOptions(opts));
  }

  /** PUT /resource/:id */
  put<T, B = unknown>(path: string, body: B, opts: WriteOptions = {}) {
    const url = this.resolveUrl(path);
    return this.http.put<T>(url, body, this.toHttpOptions(opts));
  }

  /** PATCH /resource/:id */
  patch<T, B = unknown>(path: string, body: B, opts: WriteOptions = {}) {
    const url = this.resolveUrl(path);
    return this.http.patch<T>(url, body, this.toHttpOptions(opts));
  }

  /** DELETE /resource/:id */
  delete<T>(path: string, opts: DeleteOptions = {}) {
    const url = this.resolveUrl(path);
    const httpOpts = this.toHttpOptions(opts);
    // Angular supports DELETE with a body via options.body
    (httpOpts as any).body = opts.body;
    return this.http.delete<T>(url, httpOpts);
  }

  /** HEAD /resource (useful for health checks, ETag probes) */
  head<T = void>(path: string, opts: RequestOptions = {}) {
    const url = this.resolveUrl(path);
    return this.http.head<T>(url, this.toHttpOptions(opts));
  }

  // ---- helpers -------------------------------------------------------------

  private resolveUrl(path: string): string {
    // If full URL, don't prefix
    if (/^https?:\/\//i.test(path)) return path;
    const base = (this.baseUrl ?? '').replace(/\/+$/, '');
    const cleanPath = path.replace(/^\/+/, '');
    return base ? `${base}/${cleanPath}` : `/${cleanPath}`;
  }

  private toHttpOptions(opts: RequestOptions) {
    const { params, headers, context, withCredentials } = opts;
    return {
      params: this.buildHttpParams(params),
      headers: this.buildHeaders(headers),
      context,
      withCredentials,
    };
  }

  private buildHttpParams(params?: Params): HttpParams | undefined {
    if (!params) return undefined;
    let hp = new HttpParams();

    const append = (key: string, val: Primitive) => {
      const str =
        val instanceof Date ? val.toISOString() : (val as any).toString();
      hp = hp.append(key, str);
    };

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        value.forEach(v => {
          if (v !== undefined && v !== null) append(key, v);
        });
      } else {
        append(key, value);
      }
    }
    return hp;
  }

  private buildHeaders(
    headers?: Record<string, string> | HttpHeaders
  ): HttpHeaders | undefined {
    if (!headers) return undefined;
    return headers instanceof HttpHeaders ? headers : new HttpHeaders(headers);
  }
}

---- 
// Tip for your retry/timeout use: anywhere in a domain service you can do
  

  import { HttpContext } from '@angular/common/http';
import { RETRY_MAX_ATTEMPTS, TIMEOUT_MS } from '../core/http/retry.tokens';

const ctx = new HttpContext().set(RETRY_MAX_ATTEMPTS, 6).set(TIMEOUT_MS, 20000);
return this.api.get<User[]>('/users', { context: ctx });



-----

  // RETRY INTERCPTOR:

// src/app/core/http/retry.interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError, timer } from 'rxjs';
import { retry, timeout } from 'rxjs/operators';
import {
  RETRY_ENABLED, RETRY_MAX_ATTEMPTS, RETRY_BASE_DELAY_MS, RETRY_MAX_DELAY_MS,
  RETRY_NON_IDEMPOTENT, TIMEOUT_MS
} from './retry.tokens';

function isRetryable(err: HttpErrorResponse): boolean {
  // network/CORS = status 0; 408 timeout; 429 rate limit; 5xx server errors
  return err.status === 0 || err.status === 408 || err.status === 429 || (err.status >= 500 && err.status < 600);
}

function backoffMs(tryIndex: number, base: number, cap: number): number {
  // tryIndex starts at 1 for the first retry
  const exp = Math.min(cap, base * Math.pow(2, tryIndex - 1));
  const jitter = Math.random() * exp * 0.3; // full-jitter ~30%
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
    // give each attempt its own cap; helps turn long cold-start waits into controlled retries
    timeout({ first: perAttemptTimeout }),
    enabled
      ? retry({
          count: max,
          resetOnSuccess: true,
          delay: (error, retryCount) => {
            const err = error as HttpErrorResponse;
            const canRetry = isRetryable(err) && (idempotent || allowNonIdempotent) && navigator.onLine !== false;
            if (!canRetry) {
              return throwError(() => error);
            }
            return timer(backoffMs(retryCount, base, cap));
          }
        })
      : (src) => src
  );
};


---- tokens:

// src/app/core/http/retry.tokens.ts
import { HttpContextToken } from '@angular/common/http';

export const RETRY_ENABLED = new HttpContextToken<boolean>(() => true);
export const RETRY_MAX_ATTEMPTS = new HttpContextToken<number>(() => 5); // retries (total attempts = 1 + this)
export const RETRY_BASE_DELAY_MS = new HttpContextToken<number>(() => 500);
export const RETRY_MAX_DELAY_MS = new HttpContextToken<number>(() => 8000);
export const RETRY_NON_IDEMPOTENT = new HttpContextToken<boolean>(() => false); // allow POST/PUT if you opt-in
export const TIMEOUT_MS = new HttpContextToken<number>(() => 15000); // 15s per attempt is cold-start friendly



