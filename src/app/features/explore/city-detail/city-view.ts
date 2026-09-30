import { OpenPlace, ContinentData, flagImageUrl } from '../../../core/data/travel-data';
import { barWidth, cityWeight, fmtPct, pct } from '../../../core/data/travel-calc';
import { Strings } from '../../../core/i18n/strings';

export interface CityView {
  name: string;
  /** `Ecuador · South America`. */
  kicker: string;
  /** Label for a problem report, e.g. `Ecuador · Quito`. */
  placeLabel: string;
  flag: string;
  pct: string;
  bar: string;
  formula: string;
  nRatio: string;
  lRatio: string;
  discCount: string;
  discList: string[];
  openCount: string;
  openList: OpenPlace[];
}

/** A city (path `[continent, country, city]`) with its score breakdown and what is still open. */
export function buildCityView(tree: ContinentData[], path: number[], t: Strings): CityView {
  const cn = tree[path[0]];
  const co = cn.countries[path[1]];
  const ct = co.cities[path[2]];
  const w = cityWeight(ct);
  const p = pct(w);
  const openN = ct.nt - ct.nv;
  const openL = ct.lt - ct.lv;
  return {
    name: ct.name,
    kicker: `${co.name} · ${cn.name}`,
    placeLabel: `${co.name} · ${ct.name}`,
    flag: flagImageUrl(co.name),
    pct: fmtPct(p),
    bar: barWidth(p),
    formula: t.city.formula(w.v, w.t, ct.nv, ct.lv),
    nRatio: `${ct.nv} / ${ct.nt}`,
    lRatio: `${ct.lv} / ${ct.lt}`,
    discCount: String(ct.disc.length),
    discList: ct.disc.length ? ct.disc : [t.detail.nothingLogged],
    openCount: t.city.openCount(openN, openL),
    openList: ct.open.length
      ? ct.open.map((place) => ({ ...place, kind: t.detail.placeKinds[place.kind] ?? place.kind }))
      : [{ name: t.city.notItemised(openN, openL), kind: t.city.seedData }],
  };
}
