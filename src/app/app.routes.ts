import { provideRouter, Routes, withComponentInputBinding } from '@angular/router';

import { Shell } from './layout/shell/shell';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'explore' },
      { path: 'explore', loadChildren: () => import('./features/explore/explore.routes').then((m) => m.EXPLORE_ROUTES) },
      { path: 'left', loadComponent: () => import('./features/whats-left/whats-left').then((m) => m.WhatsLeft) },
      { path: 'timeline', loadComponent: () => import('./features/timeline/timeline').then((m) => m.Timeline) },
      { path: 'add', loadComponent: () => import('./features/add-visit/add-visit').then((m) => m.AddVisit) },
      { path: '**', redirectTo: 'explore' },
    ],
  },
];

/** Router providers for the app. Route data and resolved values bind to component inputs. */
export const provideAppRouter = () => provideRouter(routes, withComponentInputBinding());
