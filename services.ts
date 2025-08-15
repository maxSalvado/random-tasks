/* Make the overlay completely cover and hide content behind it */
ion-loading.app-loading-overlay {
  /* Backdrop (the dim layer covering your app) */
  --backdrop-opacity: 1;                       // fully opaque
  --backdrop-color: var(--ion-background-color, #fff); // match your app bg (white by default)

  /* Loading card */
  --background: transparent;       // remove card background
  --spinner-color: var(--ion-color-primary, #3880ff);

  /* Optional: tweak message style */
  --color: var(--ion-text-color, #000);
}

/* Extra polish for the wrapper/content parts if available */
ion-loading.app-loading-overlay::part(content) {
  box-shadow: none;
  border-radius: 0;
  padding: 0.5rem 1rem;
}

ion-loading.app-loading-overlay::part(backdrop) {
  /* Redundant with vars above, but forces full cover if needed */
  background: var(--ion-background-color, #fff);
  opacity: 1;
}
