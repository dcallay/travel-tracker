import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { App } from './app';
import { provideAppRouter } from './app.routes';

describe('App routing', () => {
  let fixture: ComponentFixture<App>;
  let el: HTMLElement;
  let router: Router;

  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const visit = async (url: string) => {
    await router.navigateByUrl(url);
    await settle();
  };
  const all = (sel: string) => Array.from(el.querySelectorAll<HTMLElement>(sel));
  const text = (sel: string) => el.querySelector(sel)?.textContent?.trim() ?? null;
  const clickByText = async (sel: string, label: string) => {
    const node = all(sel).find((n) => n.textContent?.trim().startsWith(label));
    expect(node, `"${label}" in ${sel}`).toBeTruthy();
    node!.click();
    await settle();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideAppRouter()],
    }).compileComponents();
    fixture = TestBed.createComponent(App);
    el = fixture.nativeElement;
    router = TestBed.inject(Router);
  });

  describe('URLs', () => {
    it('sends the root and unknown URLs to the world view', async () => {
      await visit('/');
      expect(router.url).toBe('/explore');
      await visit('/nowhere/at/all');
      expect(router.url).toBe('/explore');
      expect(text('.tt-table-head h4')).toBe('By continent');
    });

    it('opens a place straight from its URL', async () => {
      await visit('/explore/south-america/ecuador/quito');
      expect(text('.tt-detail__title')).toBe('Quito');
      expect(all('.tt-crumb').map((c) => c.textContent?.trim())).toEqual([
        'World',
        'South America',
        'Ecuador',
        'Quito',
      ]);
      expect(text('.tt-parent-score__label')).toBe('Ecuador explored');

      await visit('/explore/europe/portugal');
      expect(text('.tt-detail__title')).toBe('Portugal');

      await visit('/explore/asia');
      expect(text('.tt-table-head h4')).toBe('Asia');
    });

    it('reads accented names from plain slugs', async () => {
      await visit('/explore/south-america/ecuador/banos');
      expect(text('.tt-detail__title')).toBe('Baños');
    });

    it('sends an unknown place to the world view', async () => {
      await visit('/explore/atlantis');
      expect(router.url).toBe('/explore');
      await visit('/explore/south-america/portugal');
      expect(router.url).toBe('/explore');
      await visit('/explore/south-america/ecuador/lisbon');
      expect(router.url).toBe('/explore');
      expect(text('.tt-table-head h4')).toBe('By continent');
    });

    it('serves the other sections at their own URLs', async () => {
      await visit('/left');
      expect(text('.tt-left h4')).toBe("What's still open");
      await visit('/timeline');
      expect(text('.tt-timeline h4')).toBe('Travel history');
      await visit('/add');
      expect(text('.tt-add h4')).toBe('Add a visit');
    });
  });

  describe('navigating by clicks', () => {
    beforeEach(() => visit('/'));

    it('puts each drill-down step in the URL', async () => {
      await clickByText('.table tbody tr', 'Europe');
      expect(router.url).toBe('/explore/europe');
      await clickByText('.table tbody tr', 'Portugal');
      expect(router.url).toBe('/explore/europe/portugal');
      await clickByText('.tt-city-row', 'Lisbon');
      expect(router.url).toBe('/explore/europe/portugal/lisbon');
      await clickByText('.tt-crumb', 'Europe');
      expect(router.url).toBe('/explore/europe');
      await clickByText('.tt-crumb', 'World');
      expect(router.url).toBe('/explore');
    });

    it('follows a map click to the country', async () => {
      el.querySelector('world-coverage-map')!.dispatchEvent(
        new CustomEvent('country-select', {
          detail: { name: 'Portugal' },
          bubbles: true,
          composed: true,
        }),
      );
      await settle();
      expect(router.url).toBe('/explore/europe/portugal');
    });

    it('marks the current section in the sidebar, including while drilled down', async () => {
      expect(text('.tt-nav__item.is-active')).toContain('Explore');
      await clickByText('.table tbody tr', 'Europe');
      expect(all('.tt-nav__item.is-active')).toHaveLength(1);
      expect(text('.tt-nav__item.is-active')).toContain('Explore');

      await clickByText('.tt-nav__item', "What's left");
      expect(router.url).toBe('/left');
      expect(text('.tt-nav__item.is-active')).toContain("What's left");
      await clickByText('.tt-nav__item', 'Timeline');
      expect(router.url).toBe('/timeline');
    });

    it('drops the crumbs and parent score outside the explore section', async () => {
      await visit('/explore/europe/portugal');
      await clickByText('.tt-nav__item', 'Timeline');
      expect(all('.tt-crumb').map((c) => c.textContent?.trim())).toEqual(['World']);
      expect(all('.tt-crumb.is-active')).toHaveLength(0);
      expect(el.querySelector('.tt-parent-score')).toBeNull();
    });
  });

  describe('add a visit', () => {
    it('returns to the place it was opened from', async () => {
      await visit('/explore/europe/portugal/lisbon');
      await clickByText('.tt-header .btn-primary', 'Add a visit');
      expect(router.url).toBe('/add');
      await clickByText('.tt-add__actions .btn', 'Cancel');
      expect(router.url).toBe('/explore/europe/portugal/lisbon');
    });

    it('returns to the world when opened from another section', async () => {
      await visit('/timeline');
      await clickByText('.tt-header .btn-primary', 'Add a visit');
      await clickByText('.tt-add__actions .btn', 'Save visit');
      expect(router.url).toBe('/explore');
    });

    it('returns to the world when opened directly by URL', async () => {
      await visit('/add');
      await clickByText('.tt-add__actions .btn', 'Cancel');
      expect(router.url).toBe('/explore');
    });
  });
});
