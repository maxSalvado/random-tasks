/* ================================
   Custom font faces
   ================================ */

/* SANS family (300 / 400 / 700) */
@font-face {
  font-family: 'ABC Sans';
  src: url('/assets/fonts/abcSans-Light.woff2') format('woff2');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'ABC Sans';
  /* If your file is actually abcSanS-Normal.woff2, keep that exact case-sensitive name */
  src: url('/assets/fonts/abcSans-Normal.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'ABC Sans';
  src: url('/assets/fonts/abcSans-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* SERIF family (400 / 700) */
@font-face {
  font-family: 'ABC Serif';
  src: url('/assets/fonts/abcSerif-Normal.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'ABC Serif';
  src: url('/assets/fonts/abcSerif-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* ================================
   Make ABC Sans the Ionic default
   ================================ */
:root {
  /* Ionic uses this var for typography across components */
  --ion-font-family: 'ABC Sans', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

  /* Optional: improve rendering */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Ensure the body inherits the Ionic font variable */
html, body, ion-app {
  font-family: var(--ion-font-family);
}

/* ================================
   (Optional) Use Serif for headings
   ================================ */
.heading-serif,
h1.serif, h2.serif, h3.serif,
h1.serif *, h2.serif *, h3.serif * {
  font-family: 'ABC Serif', Georgia, 'Times New Roman', serif;
}

/* Example: global heading style (only if you want all headings serif)
h1, h2, h3 {
  font-family: 'ABC Serif', Georgia, 'Times New Roman', serif;
  font-weight: 700;
}
*/




-------------------



  
