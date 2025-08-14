// src/app/core/http/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { SKIP_AUTH } from './auth.tokens';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_AUTH)) return next(req); // <-- don't add Authorization
  const token = localStorage.getItem('access_token');
  return next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req);
};




---

  // src/app/core/startup/warmup.service.ts
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../http/api-client';

@Injectable({ providedIn: 'root' })
export class WarmupService {
  private base = inject(API_BASE_URL);

  async ping(): Promise<void> {
    // Target a super-cheap anonymous function, e.g. GET /api/healthz
    const url = `${this.base.replace(/\/+$/, '')}/healthz`;
    try {
      await fetch(url, {
        method: 'GET',
        mode: 'no-cors',     // avoids CORS preflight entirely
        cache: 'no-store',
        keepalive: true
      });
    } catch { /* ignore: we only care about waking the app */ }
  }
}


---


  // src/app/core/startup/warmup.initializer.ts
import { APP_INITIALIZER, FactoryProvider, inject } from '@angular/core';
import { WarmupService } from './warmup.service';

function warmupFactory() {
  const warm = inject(WarmupService);
  return async () => { await warm.ping(); };
}

export const WarmupInitializer: FactoryProvider = {
  provide: APP_INITIALIZER,
  useFactory: warmupFactory,
  multi: true
};



---

  
