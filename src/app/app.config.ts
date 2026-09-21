import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

import { provideAppRouter } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideAppRouter()],
};
