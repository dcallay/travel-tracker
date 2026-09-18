import { CityData, ContinentData, CountryData } from './travel-data';

export interface Weight {
  v: number;
  t: number;
}

/** A city's weight: neighbourhoods count 1 each, landmarks count 2 each. */
export function cityWeight(city: CityData): Weight {
  return { v: city.nv + city.lv * 2, t: city.nt + city.lt * 2 };
}

export function countryWeight(country: CountryData): Weight {
  return country.cities.reduce(
    (acc, c) => {
      const w = cityWeight(c);
      return { v: acc.v + w.v, t: acc.t + w.t };
    },
    { v: 0, t: country.rest },
  );
}

export function continentWeight(continent: ContinentData): Weight {
  return continent.countries.reduce(
    (acc, co) => {
      const w = countryWeight(co);
      return { v: acc.v + w.v, t: acc.t + w.t };
    },
    { v: 0, t: 0 },
  );
}

export function pct(w: Weight): number {
  return w.t ? (w.v / w.t) * 100 : 0;
}

export function fmtPct(p: number): string {
  return p.toFixed(1) + '%';
}

/** Bar width as a CSS percentage — non-zero coverage always shows a sliver. */
export function barWidth(p: number): string {
  return (p === 0 ? 0 : Math.max(0.8, Math.min(100, p))) + '%';
}
