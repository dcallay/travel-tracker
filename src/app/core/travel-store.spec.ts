import { TestBed } from '@angular/core/testing';

import { cityWeight } from '../data/travel-calc';
import { TRAVEL_TREE } from '../data/travel-data';
import { TravelStore } from './travel-store';

describe('TravelStore', () => {
  let store: TravelStore;

  beforeEach(() => {
    store = TestBed.inject(TravelStore);
  });

  it('sums the weights of every continent into the world figure', () => {
    const totals = store.worldTotals();
    const cities = TRAVEL_TREE.flatMap((cn) => cn.countries.flatMap((co) => co.cities));
    const visitedWeight = cities.reduce((sum, ct) => sum + cityWeight(ct).v, 0);

    expect(totals.worldV).toBe(visitedWeight);
    expect(totals.worldT).toBeGreaterThan(totals.worldV);
    expect(store.worldPct()).toBeCloseTo((totals.worldV / totals.worldT) * 100, 10);
  });

  it('counts touched countries, logged cities and discoveries', () => {
    const totals = store.worldTotals();
    const cities = TRAVEL_TREE.flatMap((cn) => cn.countries.flatMap((co) => co.cities));

    expect(totals.citiesLogged).toBe(cities.filter((ct) => cityWeight(ct).v > 0).length);
    expect(totals.discoveries).toBe(cities.reduce((sum, ct) => sum + ct.disc.length, 0));
    expect(totals.landmarks).toBe(cities.reduce((sum, ct) => sum + ct.lv, 0));
    expect(Object.keys(totals.mapData)).toHaveLength(
      TRAVEL_TREE.reduce((sum, cn) => sum + cn.countries.length, 0),
    );
  });

  it('gives untouched countries a map value of 0 and touched ones a positive value', () => {
    const { mapData } = store.worldTotals();
    expect(mapData['Morocco']).toBe(0);
    expect(mapData['Ecuador']).toBeGreaterThan(0);
  });

  it('lists only visited cities, closest to done first, with a path to each', () => {
    const rows = store.leftRows();

    expect(rows.map((r) => r.name)).not.toContain('Baños');
    expect(rows.map((r) => r.sort)).toEqual([...rows.map((r) => r.sort)].sort((a, b) => b - a));
    for (const row of rows) {
      const [i, j, k] = row.path;
      expect(TRAVEL_TREE[i].countries[j].cities[k].name).toBe(row.name);
    }
  });

  describe('countryPathForMapName', () => {
    it('finds a country by name', () => {
      const [i, j] = store.countryPathForMapName('Portugal')!;
      expect(TRAVEL_TREE[i].countries[j].name).toBe('Portugal');
    });

    it("resolves the map's spelling of the United States", () => {
      const [i, j] = store.countryPathForMapName('United States of America')!;
      expect(TRAVEL_TREE[i].countries[j].name).toBe('United States');
    });

    it('returns null for a country that is not on file', () => {
      expect(store.countryPathForMapName('Atlantis')).toBeNull();
    });
  });
});
