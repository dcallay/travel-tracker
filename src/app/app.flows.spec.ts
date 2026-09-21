import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { App } from './app';
import { provideAppRouter } from './app.routes';
import { TIMELINE, TRAVEL_TREE } from './data/travel-data';
import { cityWeight } from './data/travel-calc';

/**
 * User-flow tests that drive the rendered UI through clicks and read it back through the DOM.
 * They deliberately avoid component internals so they keep passing while the page is split up.
 */
describe('App flows', () => {
  let fixture: ComponentFixture<App>;
  let el: HTMLElement;

  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const all = (sel: string) => Array.from(el.querySelectorAll<HTMLElement>(sel));
  const text = (sel: string) => el.querySelector(sel)?.textContent?.trim() ?? null;
  const click = async (node: Element | null | undefined) => {
    expect(node, 'element to click').toBeTruthy();
    (node as HTMLElement).click();
    await settle();
  };
  const clickByText = async (sel: string, label: string) =>
    click(all(sel).find((n) => n.textContent?.trim().startsWith(label)));
  /** Mimics the map element reporting a click on a country. */
  const clickMapCountry = async (name: string) => {
    el.querySelector('world-coverage-map')!.dispatchEvent(
      new CustomEvent('country-select', { detail: { name }, bubbles: true, composed: true }),
    );
    await settle();
  };
  const pressEscape = async () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await settle();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideAppRouter()],
    }).compileComponents();
    fixture = TestBed.createComponent(App);
    el = fixture.nativeElement;
    await TestBed.inject(Router).navigateByUrl('/');
    await settle();
  });

  describe('explore', () => {
    it('starts at the world level with continents and stats, without the parent score', () => {
      expect(text('.tt-crumb.is-active')).toBe('World');
      expect(all('.tt-stat')).toHaveLength(4);
      expect(text('.tt-stat__label')).toBe('World explored');
      expect(text('.tt-table-head h4')).toBe('By continent');
      expect(all('.table tbody tr')).toHaveLength(TRAVEL_TREE.length);
      expect(el.querySelector('.tt-parent-score')).toBeNull();
      expect(el.querySelectorAll('world-coverage-map')).toHaveLength(1);
    });

    it('drills world → continent → country → city and back via the breadcrumbs', async () => {
      await clickByText('.table tbody tr', 'South America');
      expect(text('.tt-table-head h4')).toBe('South America');
      expect(text('.table thead th')).toBe('Country');
      expect(all('.table tbody tr')).toHaveLength(5);
      expect(text('.tt-parent-score__label')).toBe('World explored');
      expect(all('.tt-crumb').map((c) => c.textContent?.trim())).toEqual(['World', 'South America']);

      await clickByText('.table tbody tr', 'Ecuador');
      expect(text('.tt-detail__title')).toBe('Ecuador');
      expect(text('.tt-detail__kicker')).toBe('South America');
      expect(text('.tt-parent-score__label')).toBe('South America explored');
      expect(el.querySelector('world-coverage-map')?.getAttribute('country')).toBe('Ecuador');
      // cities are sorted closest-to-done first, unvisited last
      const cityNames = all('.tt-city-row__name').map((n) => n.textContent?.trim());
      expect(cityNames).toEqual(['Quito', 'Cuenca', 'Guayaquil', 'Baños']);

      await clickByText('.tt-city-row', 'Quito');
      expect(text('.tt-detail__title')).toBe('Quito');
      expect(text('.tt-detail__kicker')).toBe('Ecuador · South America');
      expect(text('.tt-parent-score__label')).toBe('Ecuador explored');
      expect(text('.tt-metric')).toMatch(/^\d+\.\d%$/);
      expect(all('.tt-open-row')).toHaveLength(6);

      await clickByText('.tt-crumb', 'South America');
      expect(text('.tt-table-head h4')).toBe('South America');
      await clickByText('.tt-crumb', 'World');
      expect(text('.tt-table-head h4')).toBe('By continent');
    });

    it('shows an empty note for a continent with no visits', async () => {
      await clickByText('.table tbody tr', 'Africa');
      expect(text('.tt-empty-note p')).toContain('Nothing logged in Africa yet');
    });

    it('opens a country when the map reports a click, including the US alias', async () => {
      await clickMapCountry('Portugal');
      expect(text('.tt-detail__title')).toBe('Portugal');

      await clickByText('.tt-crumb', 'World');
      await clickMapCountry('United States of America');
      expect(text('.tt-detail__title')).toBe('United States');
    });

    it('toggles the local knowledge list on a country', async () => {
      await clickByText('.table tbody tr', 'Europe');
      await clickByText('.table tbody tr', 'Portugal');
      expect(el.querySelector('.tt-lks__body')).toBeNull();
      await click(el.querySelector('.tt-lks__toggle'));
      expect(all('.tt-lks__list-item').length).toBeGreaterThan(0);
      await click(el.querySelector('.tt-lks__toggle'));
      expect(el.querySelector('.tt-lks__body')).toBeNull();
    });
  });

  describe('other views', () => {
    it("lists every visited city under What's left", async () => {
      await clickByText('.tt-nav__item', "What's left");
      const visited = TRAVEL_TREE.flatMap((cn) => cn.countries.flatMap((co) => co.cities)).filter(
        (ct) => cityWeight(ct).v > 0,
      );
      expect(text('.tt-left h4')).toBe("What's still open");
      expect(all('.tt-left__table tbody tr')).toHaveLength(visited.length);
      expect(text('.tt-nav__item.is-active')).toContain("What's left");

      await clickByText('.tt-left__table tbody tr', 'Lisbon');
      expect(text('.tt-detail__title')).toBe('Lisbon');
    });

    it('renders the timeline', async () => {
      await clickByText('.tt-nav__item', 'Timeline');
      expect(all('.tt-timeline__item')).toHaveLength(TIMELINE.length);
      expect(all('.tt-timeline__tags .tag-outline').map((t) => t.textContent?.trim())).toEqual(
        TIMELINE.filter((t) => t.source === 'Manual').map(() => 'Manual'),
      );
    });

    it('opens the add-visit form and leaves it via Cancel', async () => {
      await click(all('.tt-header .btn-primary')[0]);
      expect(text('.tt-add h4')).toBe('Add a visit');
      expect(el.querySelector('#tt-place')).toBeTruthy();
      await clickByText('.tt-add__actions .btn', 'Cancel');
      expect(el.querySelector('.tt-add')).toBeNull();
      expect(text('.tt-table-head h4')).toBe('By continent');
    });

    it('resets to the top level when switching nav from a drilled-down place', async () => {
      await clickByText('.table tbody tr', 'Europe');
      await clickByText('.tt-nav__item', 'Timeline');
      await clickByText('.tt-nav__item', 'Explore');
      expect(text('.tt-table-head h4')).toBe('By continent');
    });
  });

  describe('header', () => {
    it('switches language from the menu', async () => {
      expect(el.querySelector('.tt-lang__menu')).toBeNull();
      await click(el.querySelector('.tt-lang .btn'));
      expect(all('.tt-lang__item')).toHaveLength(5);
      await clickByText('.tt-lang__item', 'Español');
      expect(el.querySelector('.tt-lang__menu')).toBeNull();
      expect(text('.tt-lang .btn')).toContain('ES');
    });
  });

  describe('dialogs', () => {
    it('explains the score from the info button and closes on Escape, backdrop and button', async () => {
      await click(el.querySelector('.tt-stat .tt-info-btn'));
      expect(text('.dialog-title')).toBe('How the score is calculated');
      await pressEscape();
      expect(el.querySelector('.dialog')).toBeNull();

      await click(el.querySelector('.tt-stat .tt-info-btn'));
      await click(el.querySelector('.dialog-backdrop'));
      expect(el.querySelector('.dialog')).toBeNull();

      await click(el.querySelector('.tt-stat .tt-info-btn'));
      await click(el.querySelector('.dialog'));
      expect(el.querySelector('.dialog')).toBeTruthy();
      await clickByText('.dialog-actions .btn', 'Got it');
      expect(el.querySelector('.dialog')).toBeNull();
    });

    it('sends general feedback from the sidebar', async () => {
      await clickByText('.tt-sidebar__feedback .btn', 'Send feedback');
      expect(text('.dialog-kicker')).toBe('Feedback');
      expect(text('.dialog-title')).toBe('Send feedback');
      expect(el.querySelector('.tt-dialog-about')).toBeNull();
      await clickByText('.dialog-actions .btn', 'Send');
      expect(text('.dialog-title')).toBe('Thanks — it is logged');
      await clickByText('.dialog-actions .btn', 'Close');
      expect(el.querySelector('.dialog')).toBeNull();
    });

    it('files a report against the current city, prefilled with the place', async () => {
      await clickByText('.table tbody tr', 'South America');
      await clickByText('.table tbody tr', 'Ecuador');
      await clickByText('.tt-city-row', 'Quito');
      await clickByText('.tt-report-row .btn', 'Something wrong here?');
      expect(text('.dialog-kicker')).toBe('Report a problem');
      expect(text('.tt-dialog-about__place')).toBe('Ecuador · Quito');
      expect(all('.dialog .seg-opt')).toHaveLength(4);
      await clickByText('.dialog-actions .btn', 'Send');
      expect(text('.dialog-body')).toContain('Logged against Ecuador · Quito');
    });

    it('opens and dismisses the photo confirmation dialog', async () => {
      await clickByText('.tt-header .btn-secondary', 'Confirm 2 detections');
      expect(text('.dialog-kicker')).toBe('Photo recognition');
      await clickByText('.dialog-actions .btn', 'Confirm visit');
      expect(el.querySelector('.dialog')).toBeNull();
    });
  });
});
