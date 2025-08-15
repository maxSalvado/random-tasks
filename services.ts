<div class="cover" *ngIf="loading.isLoading()">
  <ion-spinner name="lines"></ion-spinner>
  <p class="message">Loading…</p>
</div>


.cover {
  position: fixed;
  inset: 0;                       // top:0; right:0; bottom:0; left:0
  z-index: 9999;                  // above your app shell
  display: grid;
  place-items: center;
  background: var(--ion-background-color, #fff); // fully hide content
  pointer-events: all;
  transition: opacity 200ms ease;
  opacity: 1;

  /* Optional: add a soft fade-in */
  &.ng-trigger, &.ng-animating { opacity: 1; }
}

.cover .message {
  margin-top: 0.75rem;
  font-size: 0.95rem;
  color: var(--ion-text-color, #000);
  opacity: 0.8;
}

/* Spinner sizing */
.cover ion-spinner {
  width: 40px;
  height: 40px;
}

/* Optional: blur the underlying app when loading (works with transparent bg) */
// .cover { background: rgba(255,255,255,0.6); backdrop-filter: blur(6px); }
