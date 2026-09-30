import { isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { inject } from '@vercel/analytics';
import { appConfig } from './app/app.config';
import { App } from './app/app';

inject({ mode: isDevMode() ? 'development' : 'production' });

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
