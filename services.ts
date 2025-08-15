src/app/core/loading.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private pending = signal(0);
  // UI flag the template will read
  isLoading = signal(false);

  // Anti-flicker timers (tweak as you like)
  private showDelayMs = 200;   // don’t show for super fast requests
  private minVisibleMs = 150;  // keep it visible briefly once shown
  private showTimer: any;
  private hideTimer: any;
  private shownAt = 0;

  start() {
    this.pending.update(v => v + 1);

    // First request → schedule show after a delay
    if (this.pending() === 1) {
      clearTimeout(this.hideTimer);
      this.showTimer = setTimeout(() => {
        this.isLoading.set(true);
        this.shownAt = Date.now();
      }, this.showDelayMs);
    }
  }

  stop() {
    this.pending.update(v => Math.max(0, v - 1));
    if (this.pending() === 0) {
      clearTimeout(this.showTimer);
      const timeVisible = Date.now() - this.shownAt;
      const remaining = Math.max(this.minVisibleMs - timeVisible, 0);

      this.hideTimer = setTimeout(() => {
        this.isLoading.set(false);
      }, remaining);
    }
  }
}



----


  src/app/core/loading.interceptor.ts

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';
import { SKIP_LOADING } from './http-context-tokens';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(LoadingService);

  // Skip assets or explicit opt-out
  const skip = req.url.startsWith('/assets') || req.context.get(SKIP_LOADING);
  if (skip) {
    return next(req);
  }

  loading.start();
  return next(req).pipe(
    finalize(() => loading.stop())
  );
};



------

  src/app/shared/global-loading.component.ts

import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LoadingService } from '../core/loading.service';

@Component({
  selector: 'app-global-loading',
  standalone: true,
  imports: [IonicModule],
  template: `
    <ion-loading
      [isOpen]="loading.isLoading()"
      message="Loading…"
      spinner="lines"
      translucent="true"
      backdrop-dismiss="false">
    </ion-loading>
  `
})
export class GlobalLoadingComponent {
  constructor(public loading: LoadingService) {}
}


<!-- Overlay goes at the root -->
  <app-global-loading></app-global-loading>


---------------
  

  
