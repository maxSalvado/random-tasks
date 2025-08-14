src/app/services/clients/language.initializer.ts

import { APP_INITIALIZER, FactoryProvider, inject } from '@angular/core';
import { LanguageClient } from './language.client';

function initLanguage() {
  const lang = inject(LanguageClient);
  // Calling getLanguage() triggers the service's initialization logic
  return () => { lang.getLanguage(); };
}

/** Register this in app.config.ts */
export const LanguageInitializer: FactoryProvider = {
  provide: APP_INITIALIZER,
  useFactory: initLanguage,
  multi: true
};



------------------------------------


  
