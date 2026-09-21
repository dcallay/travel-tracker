import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';

import { TravelStore } from './travel-store';

/**
 * Turns the `:continent/:country/:city` URL params into the `path` input the place views take.
 * An unknown place redirects to the world view instead of rendering nothing.
 */
export const placePathResolver: ResolveFn<number[]> = (route) => {
  const slugs = ['continent', 'country', 'city']
    .map((param) => route.paramMap.get(param))
    .filter((slug): slug is string => !!slug);
  const path = inject(TravelStore).pathFromSlugs(slugs);
  return path ?? new RedirectCommand(inject(Router).parseUrl('/explore'));
};
