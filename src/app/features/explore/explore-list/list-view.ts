import { WorldTotals } from '../../../core/travel-store';
import { Row, toRow } from '../../../core/place-row';
import {
  cityWeight,
  continentWeight,
  countryWeight,
  fmtPct,
  pct,
} from '../../../core/data/travel-calc';
import { ContinentData } from '../../../core/data/travel-data';
import { Strings } from '../../../core/i18n/strings';

export interface StatItem {
  label: string;
  value: string;
  note: string;
  hasInfo: boolean;
}

export interface ListView {
  rows: Row[];
  colHead: string;
  levelTitle: string;
  levelSub: string;
  stats: StatItem[];
  emptyNote: string;
  mapFit: string;
  mapHeight: number;
  mapCaption: string;
  mapData: Record<string, number>;
}

/** The world (path `[]`) or one continent (path `[continent]`) as a table with stats and a map. */
export function buildListView(
  tree: ContinentData[],
  totals: WorldTotals,
  path: number[],
  t: Strings,
): ListView {
  if (path.length === 0) return buildWorldView(tree, totals, t);
  return buildContinentView(tree, totals, path[0], t);
}

function buildWorldView(tree: ContinentData[], totals: WorldTotals, t: Strings): ListView {
  const rows = tree.map((cn, i) => {
    const touched = cn.countries.filter((co) => countryWeight(co).v > 0).length;
    return toRow(
      cn.name,
      touched ? `${touched} of ${cn.countries.length} countries` : 'No visits yet',
      pct(continentWeight(cn)),
      [i],
    );
  });
  const worldPct = pct({ v: totals.worldV, t: totals.worldT });
  return {
    rows,
    colHead: 'Continent',
    levelTitle: 'By continent',
    levelSub: 'Landmarks count double neighbourhoods',
    stats: [
      {
        label: t.worldMetric,
        value: fmtPct(worldPct),
        note: t.weightedPlaces(totals.worldV, totals.worldT),
        hasInfo: true,
      },
      {
        label: t.stats.countriesTouched,
        value: String(totals.countriesTouched),
        note: t.stats.acrossTheWorld,
        hasInfo: false,
      },
      {
        label: t.stats.citiesLogged,
        value: String(totals.citiesLogged),
        note: t.stats.landmarksCheckedOff(totals.landmarks),
        hasInfo: false,
      },
      {
        label: t.stats.discoveries,
        value: String(totals.discoveries),
        note: t.stats.localKnowledgeScore,
        hasInfo: false,
      },
    ],
    emptyNote: '',
    mapFit: '',
    mapHeight: 250,
    mapCaption: t.worldMapCaption,
    mapData: totals.mapData,
  };
}

function buildContinentView(
  tree: ContinentData[],
  totals: WorldTotals,
  index: number,
  t: Strings,
): ListView {
  const cn = tree[index];
  const w = continentWeight(cn);
  const rows = cn.countries.map((co, i) => {
    const logged = co.cities.filter((ct) => cityWeight(ct).v > 0).length;
    return toRow(
      co.name,
      logged ? `${logged} of ${co.cities.length} cities logged` : 'No visits yet',
      pct(countryWeight(co)),
      [index, i],
    );
  });
  const discoveries = cn.countries.reduce(
    (a, co) => a + co.cities.reduce((b, ct) => b + ct.disc.length, 0),
    0,
  );
  const citiesLogged = cn.countries.reduce(
    (a, co) => a + co.cities.filter((ct) => cityWeight(ct).v > 0).length,
    0,
  );
  return {
    rows,
    colHead: 'Country',
    levelTitle: cn.name,
    levelSub: `${cn.countries.length} countries on file`,
    stats: [
      {
        label: t.placeMetric(cn.name),
        value: fmtPct(pct(w)),
        note: t.weightedPlaces(w.v, w.t),
        hasInfo: true,
      },
      {
        label: t.stats.countries,
        value: String(cn.countries.length),
        note: t.stats.withVisits(cn.countries.filter((co) => countryWeight(co).v > 0).length),
        hasInfo: false,
      },
      {
        label: t.stats.citiesLogged,
        value: String(citiesLogged),
        note: t.stats.inThisContinent,
        hasInfo: false,
      },
      {
        label: t.stats.discoveries,
        value: String(discoveries),
        note: t.stats.localKnowledgeScore,
        hasInfo: false,
      },
    ],
    emptyNote:
      w.v === 0
        ? `Nothing logged in ${cn.name} yet. ${cn.countries.length} countries and ${w.t} weighted places are already on file, so the moment you land somewhere the percentage starts moving.`
        : '',
    mapFit: cn.name,
    mapHeight: 360,
    mapCaption: t.continentMapCaption(cn.name),
    mapData: totals.mapData,
  };
}
