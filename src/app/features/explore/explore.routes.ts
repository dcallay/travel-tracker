import { Routes } from '@angular/router';

import { placePathResolver } from '../../core/place-path.resolver';

/** `/explore` (world), `/explore/:continent`, `…/:country` and `…/:country/:city`. */
export const EXPLORE_ROUTES: Routes = [
  {
    path: '',
    data: { path: [] },
    loadComponent: () => import('./explore-list/explore-list').then((m) => m.ExploreList),
  },
  {
    path: ':continent',
    resolve: { path: placePathResolver },
    loadComponent: () => import('./explore-list/explore-list').then((m) => m.ExploreList),
  },
  {
    path: ':continent/:country',
    resolve: { path: placePathResolver },
    loadComponent: () => import('./country-detail/country-detail').then((m) => m.CountryDetail),
  },
  {
    path: ':continent/:country/:city',
    resolve: { path: placePathResolver },
    loadComponent: () => import('./city-detail/city-detail').then((m) => m.CityDetail),
  },
];
