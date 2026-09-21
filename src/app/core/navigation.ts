import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { TravelStore } from './travel-store';

export type Section = 'explore' | 'left' | 'timeline' | 'add';

/** Where the user is, read from the router, and helpers for moving between places. */
@Injectable({ providedIn: 'root' })
export class Navigation {
  private readonly router = inject(Router);
  private readonly store = inject(TravelStore);

  private readonly urls = signal({ current: this.router.url, previous: '' });

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) =>
        this.urls.update(({ current }) => ({ current: event.urlAfterRedirects, previous: current })),
      );
  }

  private readonly segments = computed(
    () =>
      this.router.parseUrl(this.urls().current).root.children['primary']?.segments.map((s) => s.path) ??
      [],
  );

  readonly section = computed<Section>(() => {
    const first = this.segments()[0];
    return first === 'left' || first === 'timeline' || first === 'add' ? first : 'explore';
  });

  /** The place being viewed: `[]` for the world, else `[continent, country?, city?]`. */
  readonly path = computed<number[]>(() =>
    this.section() === 'explore' ? (this.store.pathFromSlugs(this.segments().slice(1)) ?? []) : [],
  );

  /** Router commands that open a place, e.g. `['/explore', 'south-america', 'ecuador']`. */
  commands(path: number[]): string[] {
    return ['/explore', ...this.store.slugsFromPath(path)];
  }

  goTo(path: number[]): void {
    void this.router.navigate(this.commands(path));
  }

  /** Leaves the add-visit form for the place the user came from, or the world. */
  finishAdd(): void {
    const { previous } = this.urls();
    if (previous.startsWith('/explore')) void this.router.navigateByUrl(previous);
    else void this.router.navigate(['/explore']);
  }
}
