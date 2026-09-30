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
      await visit('/leaderboard');
      expect(text('.tt-board h4')).toBe('Leaderboard');
      await visit('/account');
      expect(text('.tt-account h4')).toBe('My account');
    });
  });

  describe('my account', () => {
    beforeEach(() => visit('/account'));

    const type = async (sel: string, value: string) => {
      const input = el.querySelector<HTMLInputElement | HTMLSelectElement>(sel)!;
      input.value = value;
      input.dispatchEvent(new Event(input instanceof HTMLSelectElement ? 'change' : 'input'));
      await settle();
    };
    const button = (label: string) =>
      all('.tt-account__actions .btn').find((b) => b.textContent?.trim() === label) as HTMLButtonElement;

    it('shows the public profile with your stats', () => {
      expect(text('.tt-public__name')).toBe('David');
      expect(text('.tt-public .tt-row-meta')).toBe('Quito · Ecuador');
      expect(all('.tt-public__stats .tt-stat__value').map((n) => n.textContent?.trim())).toEqual([
        '3.8%',
        '13',
        '22',
        '#15',
      ]);
      expect(all('.tt-public__country')).toHaveLength(5);
      expect(button('Save changes').disabled).toBe(true);
    });

    it('updates the public profile and leaderboard only once saved', async () => {
      await type('#tt-acc-name', 'Dee');
      await type('#tt-acc-nat', 'pe');
      expect(text('.tt-public__name')).toBe('David');

      button('Save changes').click();
      await settle();
      expect(text('.tt-account__saved')).toBe('Saved');
      expect(text('.tt-public__name')).toBe('Dee');
      expect(text('.tt-public .tt-row-meta')).toBe('Quito · Peru');
      expect(text('.tt-nav__item.is-active .tt-nav__count')).toBe('Dee');

      await visit('/leaderboard');
      expect(el.querySelector('.tt-board__you .tt-board__flag')!.getAttribute('title')).toBe('Peru');
    });

    it('discards unsaved edits and refuses an empty name', async () => {
      await type('#tt-acc-name', '  ');
      expect(text('.tt-account__error')).toBe('Enter a display name');
      expect(button('Save changes').disabled).toBe(true);
      button('Discard').click();
      await settle();
      expect(el.querySelector<HTMLInputElement>('#tt-acc-name')!.value).toBe('David');
      expect(el.querySelector('.tt-account__error')).toBeNull();
    });

    it('marks the profile private and switches language on save', async () => {
      await clickByText('.seg-opt', 'Private');
      await clickByText('.seg-opt', 'Español');
      button('Save changes').click();
      await settle();
      expect(el.querySelector('.tt-public.is-private')).toBeTruthy();
      expect(text('.tt-account h4')).toBe('Mi cuenta');
      expect(text('.tt-public .tt-row-meta')).toBe('Quito · Ecuador');
      expect(all('.tt-section-note')[1].textContent?.trim()).toBe('Privado: solo tú puedes verlo');
    });
  });

  describe('leaderboard', () => {
    beforeEach(() => visit('/leaderboard'));

    it('lists the top ten travellers, then your own row with your rank', async () => {
      const rows = all('.tt-board__table tbody tr:not(.tt-board__gap)');
      expect(rows).toHaveLength(11);
      expect(rows[0].textContent).toContain('Ingrid Solberg');
      expect(all('.tt-board__you')).toHaveLength(1);
      expect(rows[10].classList).toContain('tt-board__you');
      expect(el.querySelector('.tt-board__gap')).toBeTruthy();
      expect(text('.tt-board__you .tt-col-rank')).toBe('15');
      expect(text('.tt-board__stats .tt-stat__value')).toBe('#15');
      expect(rows[0].textContent).toContain('14.6%');
      expect(el.querySelector('.tt-board__you')!.textContent).toContain('3.8%');
      expect(all('.tt-board__flag')).toHaveLength(11);
      expect(all('.tt-board__flag')[0].getAttribute('aria-label')).toBe('Norway');
      expect(el.querySelector('.tt-board__you .tt-board__flag')!.getAttribute('title')).toBe('Ecuador');
    });

    it('is reachable from the sidebar', async () => {
      await visit('/');
      await clickByText('.tt-nav__item', 'Leaderboard');
      expect(router.url).toBe('/leaderboard');
      expect(text('.tt-nav__item.is-active')).toContain('Leaderboard');
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
