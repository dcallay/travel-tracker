import { barWidth, cityWeight, continentWeight, countryWeight, fmtPct, pct } from './travel-calc';
import { CityData, ContinentData, CountryData } from './travel-data';

const city = (nv: number, nt: number, lv: number, lt: number): CityData => ({
  name: 'Testville',
  nv,
  nt,
  lv,
  lt,
  last: null,
  disc: [],
  open: [],
});

describe('travel-calc', () => {
  describe('cityWeight', () => {
    it('counts neighbourhoods once and landmarks twice', () => {
      expect(cityWeight(city(3, 10, 2, 5))).toEqual({ v: 3 + 2 * 2, t: 10 + 5 * 2 });
    });

    it('is zero visited for a city with no visits', () => {
      expect(cityWeight(city(0, 4, 0, 5))).toEqual({ v: 0, t: 14 });
    });
  });

  describe('countryWeight', () => {
    const country: CountryData = {
      name: 'Testland',
      rest: 100,
      cities: [city(1, 2, 1, 2), city(2, 4, 0, 1)],
    };

    it('adds its cities and the places on file outside them to the total only', () => {
      // city 1: v = 1 + 2 = 3, t = 2 + 4 = 6;  city 2: v = 2, t = 4 + 2 = 6
      expect(countryWeight(country)).toEqual({ v: 5, t: 12 + 100 });
    });

    it('is just the outside places when there are no cities', () => {
      expect(countryWeight({ name: 'Emptyland', rest: 40, cities: [] })).toEqual({ v: 0, t: 40 });
    });
  });

  describe('continentWeight', () => {
    it('sums every country', () => {
      const a: CountryData = { name: 'A', rest: 10, cities: [city(1, 1, 0, 0)] };
      const b: CountryData = { name: 'B', rest: 20, cities: [city(0, 2, 1, 1)] };
      const continent: ContinentData = { name: 'C', countries: [a, b] };
      expect(continentWeight(continent)).toEqual({ v: 1 + 2, t: 11 + 24 });
    });
  });

  describe('pct', () => {
    it('is visited over total as a percentage', () => {
      expect(pct({ v: 1, t: 4 })).toBe(25);
    });

    it('is 0 rather than NaN when nothing is on file', () => {
      expect(pct({ v: 0, t: 0 })).toBe(0);
    });
  });

  describe('fmtPct', () => {
    it.each([
      [0, '0.0%'],
      [12.345, '12.3%'],
      [100, '100.0%'],
    ])('%s → %s', (value, text) => {
      expect(fmtPct(value)).toBe(text);
    });
  });

  describe('barWidth', () => {
    it('is empty for zero coverage', () => {
      expect(barWidth(0)).toBe('0%');
    });

    it('shows a sliver for coverage too small to see', () => {
      expect(barWidth(0.1)).toBe('0.8%');
    });

    it('passes ordinary values through and caps at 100%', () => {
      expect(barWidth(42.5)).toBe('42.5%');
      expect(barWidth(180)).toBe('100%');
    });
  });
});
