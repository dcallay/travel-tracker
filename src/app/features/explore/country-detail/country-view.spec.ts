import { TRAVEL_TREE } from '../../../data/travel-data';
import { buildCountryView } from './country-view';

const index = (continent: string, country: string): number[] => {
  const i = TRAVEL_TREE.findIndex((c) => c.name === continent);
  return [i, TRAVEL_TREE[i].countries.findIndex((c) => c.name === country)];
};

describe('buildCountryView', () => {
  it('names the country, its continent and the label used for problem reports', () => {
    const view = buildCountryView(TRAVEL_TREE, index('South America', 'Ecuador'));
    expect(view.name).toBe('Ecuador');
    expect(view.kicker).toBe('South America');
    expect(view.placeLabel).toBe('South America · Ecuador');
    expect(view.flag).toContain('/ec.png');
  });

  it('sorts cities closest to done first and gives each a path to its city view', () => {
    const path = index('South America', 'Ecuador');
    const view = buildCountryView(TRAVEL_TREE, path);
    expect(view.cities.map((c) => c.name)).toEqual(['Quito', 'Cuenca', 'Guayaquil', 'Baños']);
    expect(view.cities[0].path).toEqual([...path, 0]);
    expect(view.cities[3].meta).toBe('Not yet visited');
  });

  it('summarises how many cities, neighbourhoods and landmarks are done', () => {
    const view = buildCountryView(TRAVEL_TREE, index('South America', 'Ecuador'));
    expect(view.cRatio).toBe('3 / 4');
    expect(view.nRatio).toBe('19 / 42');
    expect(view.lRatio).toBe('12 / 34');
    expect(view.cityCount).toBe('4 seeded');
  });

  it('prefixes discoveries with their city and shows at most six', () => {
    const view = buildCountryView(TRAVEL_TREE, index('South America', 'Ecuador'));
    expect(view.discCount).toBe('9'); // 7 in Quito + 2 in Cuenca
    expect(view.discList).toHaveLength(6);
    expect(view.discList[0]).toBe('Quito — Café Galletti, La Floresta');
  });

  it('falls back to a placeholder when nothing is logged', () => {
    const view = buildCountryView(TRAVEL_TREE, index('South America', 'Chile'));
    expect(view.discCount).toBe('0');
    expect(view.discList).toEqual(['Nothing logged here yet']);
  });

  it('marks a country with no visits as empty, with an explanation', () => {
    const view = buildCountryView(TRAVEL_TREE, index('Africa', 'Morocco'));
    expect(view.isEmpty).toBe(true);
    expect(view.emptyNote).toContain('No visits in Morocco yet');
    expect(view.emptyNote).toContain('world figure');
  });

  it('plots each city with its coordinates and whether it was visited', () => {
    const view = buildCountryView(TRAVEL_TREE, index('South America', 'Ecuador'));
    const quito = view.citiesGeo.find((c) => c.name === 'Quito')!;
    const banos = view.citiesGeo.find((c) => c.name === 'Baños')!;
    expect(quito).toMatchObject({ lon: -78.47, lat: -0.18, visited: true });
    expect(banos.visited).toBe(false);
  });
});
