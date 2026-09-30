import { computeWorldTotals } from '../../../core/travel-store';
import { TRAVEL_TREE } from '../../../core/data/travel-data';
import { EN, ES } from '../../../core/i18n/strings';
import { buildListView } from './list-view';

const totals = computeWorldTotals(TRAVEL_TREE);

describe('buildListView', () => {
  describe('world level', () => {
    const view = buildListView(TRAVEL_TREE, totals, [], EN);

    it('has a row per continent that drills into that continent', () => {
      expect(view.rows.map((r) => r.name)).toEqual(TRAVEL_TREE.map((c) => c.name));
      expect(view.rows.map((r) => r.path)).toEqual(TRAVEL_TREE.map((_, i) => [i]));
    });

    it('describes visited and unvisited continents', () => {
      const byName = Object.fromEntries(view.rows.map((r) => [r.name, r]));
      expect(byName['Africa'].meta).toBe('No visits yet');
      expect(byName['Europe'].meta).toMatch(/^\d+ of 4 countries$/);
    });

    it('leads with the world figure, flagged with an info button', () => {
      expect(view.stats).toHaveLength(4);
      expect(view.stats[0]).toMatchObject({ label: 'World explored', hasInfo: true });
      expect(view.stats.slice(1).every((s) => !s.hasInfo)).toBe(true);
      expect(view.stats[1].value).toBe(String(totals.countriesTouched));
    });

    it('maps the whole world with no fit', () => {
      expect(view.mapFit).toBe('');
      expect(view.mapData).toBe(totals.mapData);
      expect(view.emptyNote).toBe('');
    });
  });

  describe('continent level', () => {
    it('lists the continent’s countries with paths one level deeper', () => {
      const view = buildListView(TRAVEL_TREE, totals, [0], EN);
      expect(view.levelTitle).toBe('South America');
      expect(view.colHead).toBe('Country');
      expect(view.rows.map((r) => r.path)).toEqual([
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
      ]);
      expect(view.rows[0].meta).toBe('3 of 4 cities logged'); // Ecuador: Baños is unvisited
      expect(view.mapFit).toBe('South America');
    });

    it('explains an empty continent instead of showing zero stats silently', () => {
      const africa = TRAVEL_TREE.findIndex((c) => c.name === 'Africa');
      const view = buildListView(TRAVEL_TREE, totals, [africa], EN);
      expect(view.emptyNote).toContain('Nothing logged in Africa yet');
      expect(view.stats[0].value).toBe('0.0%');
    });

    it('has no empty note once something is logged', () => {
      expect(buildListView(TRAVEL_TREE, totals, [0], EN).emptyNote).toBe('');
    });
  });

  describe('stats in the chosen language', () => {
    it('labels the world stats', () => {
      const view = buildListView(TRAVEL_TREE, totals, [], ES);
      expect(view.stats.map((s) => s.label)).toEqual([
        'Explorado en el mundo',
        'Países visitados',
        'Ciudades registradas',
        'Tus descubrimientos',
      ]);
      expect(view.stats[0].note).toBe(`${totals.worldV} de ${totals.worldT} lugares ponderados`);
      expect(view.stats[2].note).toBe(`${totals.landmarks} monumentos visitados`);
    });

    it('labels the continent stats', () => {
      const view = buildListView(TRAVEL_TREE, totals, [0], ES);
      expect(view.stats.map((s) => s.label)).toEqual([
        'Explorado en South America',
        'Países',
        'Ciudades registradas',
        'Tus descubrimientos',
      ]);
      expect(view.stats[1].note).toMatch(/^\d+ con visitas$/);
      expect(view.stats[2].note).toBe('en este continente');
    });
  });
});
