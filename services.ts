import { HttpContextToken } from '@angular/common/http';

/** Global default timeout (ms) when none is specified. */
export const API_TIMEOUT_MS = new HttpContextToken<number>(() => 5000);

/** How many times to retry when the error is *TimeoutError* only. */
export const API_TIMEOUT_RETRIES = new HttpContextToken<number>(() => 1);

/** Backoff base (ms): delay before each retry = base * (attemptIndex+1). */
export const API_TIMEOUT_BACKOFF_MS = new HttpContextToken<number>(() => 300);

/** Skip timeout logic entirely for this request. */
export const API_SKIP_TIMEOUT = new HttpContextToken<boolean>(() => false);
