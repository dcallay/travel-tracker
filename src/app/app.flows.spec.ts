import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { App } from './app';
import { provideAppRouter } from './app.routes';
import { TIMELINE, TRAVEL_TREE } from './core/data/travel-data';
import { cityWeight } from './core/data/travel-calc';
import { FakeGeolocation } from './core/testing/fake-geolocation';
import { jpegWithExif } from './core/testing/photo-fixtures';

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
      expect(all('.tt-crumb').map((c) => c.textContent?.trim())).toEqual([
        'World',
        'South America',
      ]);

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

    it("shows What's left in the chosen language", async () => {
      await click(el.querySelector('.tt-lang .btn'));
      await clickByText('.tt-lang__item', 'Español');
      await clickByText('.tt-nav__item', 'Lo que falta');
      expect(text('.tt-left h4')).toBe('Lo que queda pendiente');
      expect(all('.tt-left__table th').map((n) => n.textContent?.trim())).toEqual([
        'Lugar',
        'Explorado',
        'Pendiente',
        'Descubrimientos',
      ]);
      expect(all('.tt-left__table tbody .tt-row-meta')[1].textContent?.trim()).toMatch(
        /^\d+ barrios · \d+ monumentos$/,
      );
    });

    it('renders the timeline', async () => {
      await clickByText('.tt-nav__item', 'Timeline');
      expect(all('.tt-timeline__item')).toHaveLength(TIMELINE.length);
      expect(all('.tt-timeline__tags .tag-outline').map((t) => t.textContent?.trim())).toEqual(
        TIMELINE.filter((t) => t.source === 'Manual').map(() => 'Manual'),
      );
    });

    it('renders the timeline in the chosen language', async () => {
      await click(el.querySelector('.tt-lang .btn'));
      await clickByText('.tt-lang__item', 'Español');
      await clickByText('.tt-nav__item', 'Cronología');
      expect(text('.tt-timeline h4')).toBe('Historial de viajes');
      expect(text('.tt-timeline__date')).toBe('14 sept 2026');
      expect(text('.tt-timeline__detail')).toBe('Barrio recorrido de punta a punta');
      expect(all('.tt-timeline__tags .tag-accent')[0].textContent?.trim()).toBe('Geolocalización');
      expect(all('.tt-timeline__tags .tag-neutral').map((t) => t.textContent?.trim())).toContain(
        'puntuación +1',
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

    describe('starting from a photo', () => {
      const choosePhoto = async (file: File) => {
        const input = el.querySelector<HTMLInputElement>('.tt-drop__input')!;
        Object.defineProperty(input, 'files', { value: [file], configurable: true });
        input.dispatchEvent(new Event('change'));
        await vi.waitFor(() => {
          fixture.detectChanges();
          expect(el.querySelector('.tt-photo__facts')).toBeTruthy();
        });
      };
      const value = (sel: string) => el.querySelector<HTMLInputElement>(sel)!.value;

      beforeEach(async () => {
        vi.stubGlobal(
          'URL',
          Object.assign(URL, { createObjectURL: () => 'blob:photo', revokeObjectURL: () => {} }),
        );
        await click(all('.tt-header .btn-primary')[0]);
      });

      it('fills the date and place from the photo, and restores them when it is removed', async () => {
        await choosePhoto(
          new File(
            [jpegWithExif({ date: '2026:03:14 10:22:05', lat: -0.2153, lng: -78.5036 })],
            'basilica.jpg',
            {
              type: 'image/jpeg',
            },
          ),
        );
        expect(all('.tt-photo__facts li').map((n) => n.textContent?.trim())).toEqual([
          'Taken 14 Mar 2026',
          'Taken near Quito (5 km away)',
          "Recognising the landmark itself isn't available yet — name it below",
        ]);
        expect(value('#tt-place')).toBe('Quito, Ecuador');
        expect(value('#tt-date')).toBe('14 Mar 2026');
        expect(text('.tt-add__source')).toBe('Source: photo + GPS');

        await clickByText('.tt-photo .btn', 'Remove photo');
        expect(el.querySelector('.tt-photo')).toBeNull();
        expect(value('#tt-date')).toBe('16 Sep 2026');
        expect(text('.tt-add__source')).toBe('Source: manual');
      });

      it('falls back to the file date and leaves the place to the user without GPS', async () => {
        await choosePhoto(
          new File([jpegWithExif()], 'screenshot.jpg', {
            type: 'image/jpeg',
            lastModified: new Date(2026, 6, 2).getTime(),
          }),
        );
        expect(all('.tt-photo__facts li').map((n) => n.textContent?.trim())).toEqual([
          'No capture date in the photo — using the file date, 2 Jul 2026',
          'No location in this photo — choose the place below',
          "Recognising the landmark itself isn't available yet — name it below",
        ]);
        expect(value('#tt-place')).toBe('Quito, Ecuador');
        expect(text('.tt-add__source')).toBe('Source: photo');
      });
    });

    it('goes back to the top of Explore from the site name', async () => {
      await clickByText('.table tbody tr', 'South America');
      await clickByText('.table tbody tr', 'Ecuador');
      await click(el.querySelector('.tt-sidebar__brand-name'));
      expect(text('.tt-table-head h4')).toBe('By continent');

      await clickByText('.tt-nav__item', 'Timeline');
      await click(el.querySelector('.tt-sidebar__brand-name'));
      expect(text('.tt-crumb.is-active')).toBe('World');
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
      expect(all('.tt-lang__item').map((n) => n.textContent?.trim())).toEqual([
        'English EN',
        'Español ES',
      ]);
      await clickByText('.tt-lang__item', 'Español');
      expect(el.querySelector('.tt-lang__menu')).toBeNull();
      expect(text('.tt-lang .btn')).toContain('ES');
    });

    it('translates the header into the chosen language', async () => {
      await clickByText('.table tbody tr', 'South America');
      await click(el.querySelector('.tt-lang .btn'));
      await clickByText('.tt-lang__item', 'Español');
      expect(all('.tt-crumb').map((c) => c.textContent?.trim())).toEqual([
        'Mundo',
        'South America',
      ]);
      expect(text('.tt-header .btn-secondary')).toBe('Activar detección');
      expect(text('.tt-header .btn-primary')).toBe('Añadir una visita');
      await clickByText('.tt-crumb', 'Mundo');
      expect(text('.tt-crumb.is-active')).toBe('Mundo');
    });

    it('translates the add-visit page into the chosen language', async () => {
      await click(el.querySelector('.tt-lang .btn'));
      await clickByText('.tt-lang__item', 'Español');
      await clickByText('.tt-header .btn-primary', 'Añadir una visita');
      expect(text('.tt-add h4')).toBe('Añadir una visita');
      expect(all('.tt-add .seg-opt').map((n) => n.textContent?.trim())).toEqual([
        'Barrio',
        'Monumento',
        'Descubrimiento personal',
      ]);
      expect(el.querySelector<HTMLInputElement>('#tt-date')!.value).toBe('16 sept 2026');
      expect(el.querySelector('#tt-notes')?.getAttribute('placeholder')).toBe('Opcional');
      expect(text('.tt-add__source')).toBe('Origen: manual');
      await clickByText('.tt-add__actions .btn', 'Cancelar');
      expect(el.querySelector('.tt-add')).toBeNull();
    });

    it('translates the sidebar into the chosen language', async () => {
      await clickByText('.table tbody tr', 'South America');
      await click(el.querySelector('.tt-lang .btn'));
      await clickByText('.tt-lang__item', 'Español');
      expect(text('.tt-sidebar__brand-tag')).toBe('Descubre cuánto del mundo has visto de verdad');
      expect(all('.tt-nav__item span:first-child').map((n) => n.textContent?.trim())).toEqual([
        'Explorar',
        'Lo que falta',
        'Cronología',
        'Clasificación',
        'Mi cuenta',
      ]);
      expect(text('.tt-nav__count')).toBe(`${TRAVEL_TREE.length} continentes`);
      expect(text('.tt-parent-score__label')).toBe('Explorado en el mundo');
      expect(text('.tt-parent-score__note')).toMatch(/^\d+ de \d+ lugares ponderados$/);
      expect(text('.tt-sidebar__feedback .btn')).toBe('Enviar comentarios');
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

    it('shows the feedback dialog in the chosen language', async () => {
      await clickByText('.table tbody tr', 'South America');
      await clickByText('.table tbody tr', 'Ecuador');
      await click(el.querySelector('.tt-lang .btn'));
      await clickByText('.tt-lang__item', 'Español');
      await clickByText('.tt-report-row .btn', '¿Algo no está bien?');
      expect(text('.dialog-kicker')).toBe('Informar de un problema');
      expect(text('.dialog-title')).toBe('¿Algo no está bien?');
      expect(all('.dialog .seg-opt').map((n) => n.textContent?.trim())).toEqual([
        'Recuento incorrecto',
        'Ciudad incorrecta',
        'Falta un lugar',
        'Visita que no hice',
      ]);
      expect(el.querySelector<HTMLInputElement>('.dialog .seg-opt input')!.checked).toBe(true);
      expect(el.querySelector('.tt-dialog-email input')?.getAttribute('placeholder')).toBe(
        'opcional',
      );
      await clickByText('.dialog-actions .btn', 'Enviar');
      expect(text('.dialog-title')).toBe('Gracias, ya está registrado');
      expect(text('.dialog-body')).toContain('Registrado para South America · Ecuador');
      await clickByText('.dialog-actions .btn', 'Cerrar');
      expect(el.querySelector('.dialog')).toBeNull();
    });

    describe('automatic detection', () => {
      let geo: FakeGeolocation;
      const BASILICA = [-0.2147, -78.5072] as const;
      const UNKNOWN = [-0.17, -78.49] as const;
      const stay = async ([lat, lng]: readonly [number, number], from: number) => {
        for (let m = from; m <= from + 5; m++) geo.emit(lat, lng, m);
        await settle();
      };
      const detectButton = () => el.querySelector<HTMLElement>('.tt-header .btn-secondary')!;

      beforeEach(() => {
        localStorage.clear();
        geo = new FakeGeolocation();
        geo.install();
      });

      it('explains detection before turning it on, and can be put off', async () => {
        expect(detectButton().textContent?.trim()).toBe('Turn on detection');
        await click(detectButton());
        expect(text('.dialog-kicker')).toBe('Automatic detection');
        expect(text('.dialog-title')).toBe('Log visits as you go');
        expect(text('.dialog-body')).toContain('nothing is logged without you');
        await clickByText('.dialog-actions .btn', 'Not now');
        expect(el.querySelector('.dialog')).toBeNull();
        expect(geo.watching).toBe(false);
      });

      it('lists every way to add a visit and opens detection from the add page', async () => {
        await click(all('.tt-header .btn-primary')[0]);
        expect(all('.tt-ways .tt-section-label').map((n) => n.textContent?.trim())).toEqual([
          'From a photo',
          'By hand',
          'Automatic detection',
        ]);
        const waysButton = () => el.querySelector<HTMLElement>('.tt-ways__detect')!;
        expect(waysButton().textContent?.trim()).toBe('Turn on detection');

        await click(waysButton());
        await clickByText('.dialog-actions .btn', 'Turn on detection');
        await stay(BASILICA, 0);
        expect(waysButton().textContent?.trim()).toBe('Confirm 1 detection');
        expect(waysButton().classList).toContain('is-pending');
      });

      it('confirms a matched landmark and names a place the app did not know', async () => {
        await click(detectButton());
        await clickByText('.dialog-actions .btn', 'Turn on detection');
        expect(text('.dialog-title')).toBe('Watching for visits');
        expect(text('.tt-detect-status')).toBe('Waiting for a first location fix…');

        await stay(BASILICA, 0);
        await stay(UNKNOWN, 10);
        expect(detectButton().textContent?.trim()).toBe('Confirm 2 detections');
        expect(text('.dialog-title')).toBe('2 visits to confirm');
        expect(all('.tt-detect__title').map((n) => n.textContent?.trim())).toEqual([
          'Basílica del Voto Nacional',
          'Somewhere in Quito',
        ]);
        expect(text('.tt-detect__meta')).toBe('Landmark · Quito · weight 2');

        await clickByText('.tt-detect .btn', 'Confirm');
        expect(text('.dialog-title')).toBe('1 visit to confirm');
        expect(text('.tt-detect__ask')).toBe("This spot isn't on file yet. What was it?");
        const save = all('.tt-detect .btn').find((b) => b.textContent?.trim() === 'Save visit')!;
        expect(save.hasAttribute('disabled')).toBe(true);
        const name = el.querySelector<HTMLInputElement>('.tt-detect input[type=text]')!;
        name.value = 'Café Galletti';
        name.dispatchEvent(new Event('input'));
        await settle();
        await click(save);
        expect(text('.dialog-title')).toBe('Watching for visits');
        expect(detectButton().textContent?.trim()).toBe('Detection on');

        await clickByText('.dialog-actions .btn', 'Turn off detection');
        expect(el.querySelector('.dialog')).toBeNull();
        expect(geo.watching).toBe(false);
        expect(detectButton().textContent?.trim()).toBe('Turn on detection');
      });

      it('asks what a place was when the match is rejected', async () => {
        await click(detectButton());
        await clickByText('.dialog-actions .btn', 'Turn on detection');
        await stay(BASILICA, 0);
        await clickByText('.tt-detect .btn', 'Not this place');
        expect(text('.tt-detect__title')).toBe('Somewhere in Quito');
        expect(text('.tt-detect__ask')).toBe('Then what was it?');
        await clickByText('.tt-detect .btn', 'Skip');
        expect(el.querySelector('.tt-detect')).toBeNull();
      });

      it('explains a blocked location permission', async () => {
        await click(detectButton());
        await clickByText('.dialog-actions .btn', 'Turn on detection');
        geo.deny();
        await settle();
        expect(text('.dialog-body')).toContain('Location is blocked for this site');
        expect(detectButton().textContent?.trim()).toBe('Detection blocked');
      });

      it('shows detection in the chosen language', async () => {
        await click(el.querySelector('.tt-lang .btn'));
        await clickByText('.tt-lang__item', 'Español');
        await clickByText('.tt-header .btn-secondary', 'Activar detección');
        expect(text('.dialog-kicker')).toBe('Detección automática');
        await clickByText('.dialog-actions .btn', 'Activar detección');
        await stay(BASILICA, 0);
        expect(text('.dialog-title')).toBe('1 visita por confirmar');
        expect(text('.tt-detect__meta')).toBe('Monumento · Quito · peso 2');
        await clickByText('.tt-detect .btn', 'No es este lugar');
        expect(text('.tt-detect__ask')).toBe('Entonces, ¿qué era?');
      });
    });
  });
});
