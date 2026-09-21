import { Row, toRow } from '../../../core/place-row';
import { barWidth, cityWeight, countryWeight, fmtPct, pct } from '../../../core/data/travel-calc';
import { CITY_GEO, ContinentData, flagImageUrl } from '../../../core/data/travel-data';
import { CityMarker } from '../../../shared/ui/coverage-map/coverage-map';

export interface CountryView {
  name: string;
  kicker: string;
  /** Label for a problem report, e.g. `South America · Ecuador`. */
  placeLabel: string;
  flag: string;
  pct: string;
  bar: string;
  formula: string;
  cRatio: string;
  nRatio: string;
  lRatio: string;
  discCount: string;
  discList: string[];
  cityCount: string;
  /** Cities closest to done first. */
  cities: Row[];
  isEmpty: boolean;
  emptyNote: string;
  citiesGeo: CityMarker[];
}

/** A country (path `[continent, country]`) with its score breakdown, cities and discoveries. */
export function buildCountryView(tree: ContinentData[], path: number[]): CountryView {
  const cn = tree[path[0]];
  const co = cn.countries[path[1]];
  const w = countryWeight(co);
  const p = pct(w);
  const nv = co.cities.reduce((a, ct) => a + ct.nv, 0);
  const nt = co.cities.reduce((a, ct) => a + ct.nt, 0);
  const lv = co.cities.reduce((a, ct) => a + ct.lv, 0);
  const lt = co.cities.reduce((a, ct) => a + ct.lt, 0);
  const logged = co.cities.filter((ct) => cityWeight(ct).v > 0).length;
  const disc = co.cities.flatMap((ct) => ct.disc.map((d) => `${ct.name} — ${d}`));
  const cities = co.cities
    .map((ct, i) => {
      const cwt = cityWeight(ct);
      const cp = pct(cwt);
      const row = toRow(
        ct.name,
        cwt.v ? `${ct.nv} neighbourhoods · ${ct.lv} landmarks · ${ct.last}` : 'Not yet visited',
        cp,
        [path[0], path[1], i],
      );
      return { row, cp };
    })
    .sort((a, b) => b.cp - a.cp)
    .map(({ row }) => row);
  const citiesGeo: CityMarker[] = co.cities.map((ct) => {
    const [lon, lat] = CITY_GEO[ct.name] ?? [0, 0];
    const cwt = cityWeight(ct);
    return { name: ct.name, lon, lat, visited: cwt.v > 0, pct: pct(cwt) };
  });

  return {
    name: co.name,
    kicker: cn.name,
    placeLabel: `${cn.name} · ${co.name}`,
    flag: flagImageUrl(co.name),
    pct: fmtPct(p),
    bar: barWidth(p),
    formula: `${w.v} of ${w.t} weighted places. ${nv} neighbourhoods at weight 1, ${lv} landmarks at weight 2, plus ${co.rest} weighted places elsewhere in the country still on file.`,
    cRatio: `${logged} / ${co.cities.length}`,
    nRatio: `${nv} / ${nt}`,
    lRatio: `${lv} / ${lt}`,
    discCount: String(disc.length),
    discList: disc.length ? disc.slice(0, 6) : ['Nothing logged here yet'],
    cityCount: `${co.cities.length} seeded`,
    cities,
    isEmpty: w.v === 0,
    emptyNote: `No visits in ${co.name} yet. Its ${w.t} weighted places still count against the world figure — that is the point of the denominator.`,
    citiesGeo,
  };
}
