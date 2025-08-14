// error.interceptor.ts (example)
import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    tap({
      next: (ev) => {
        if (ev instanceof HttpResponse) {
          // Success status (usually 200/201/204/304 etc.)
          // console.debug('[http ok]', ev.status, req.method, req.url);
        }
      },
      error: (err: HttpErrorResponse | unknown) => {
        if (err instanceof HttpErrorResponse) {
          // Error status (0, 4xx, 5xx)
          // console.debug('[http err]', err.status, req.method, req.url, err.message);
        } else {
          // TimeoutError or other thrown errors won't have a status
          // console.debug('[http err]', 'non-http error', req.method, req.url);
        }
      }
    })
  );
};
