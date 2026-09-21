import { Injectable, computed, signal } from '@angular/core';

import {
  barWidth,
  cityWeight,
  continentWeight,
  countryWeight,
  fmtPct,
  pct,
} from './data/travel-calc';
import { ContinentData, TIMELINE, TRAVEL_TREE } from './data/travel-data';
import { toSlug } from './slug';

export interface WorldTotals {
  worldV: number;
  worldT: number;
  countriesTouched: number;
  citiesLogged: number;
  discoveries: number;
  landmarks: number;
  /** Coverage percentage per country name, for shading the map. */
  mapData: Record<string, number>;
}

export interface LeftRow {
  name: string;
  where: string;
  pct: string;
  bar: string;
  open: string;
  disc: string;
  path: number[];
  sort: number;
}

/** The map names some countries differently from the seed data. */
const MAP_COUNTRY_ALIAS: Record<string, string> = { 'United States': 'United States of America' };

export function computeWorldTotals(tree: ContinentData[]): WorldTotals {
  let worldV = 0;
  let worldT = 0;
  let countriesTouched = 0;
  let citiesLogged = 0;
  let discoveries = 0;
  let landmarks = 0;
  const mapData: Record<string, number> = {};
  tree.forEach((cn) => {
    const w = continentWeight(cn);
    worldV += w.v;
    worldT += w.t;
    cn.countries.forEach((co) => {
      const cwt = countryWeight(co);
      mapData[co.name] = cwt.v > 0 ? Math.round(pct(cwt) * 10) / 10 : 0;
      if (cwt.v > 0) countriesTouched++;
      co.cities.forEach((ct) => {
        if (cityWeight(ct).v > 0) citiesLogged++;
        discoveries += ct.disc.length;
        landmarks += ct.lv;
      });
    });
  });
  return { worldV, worldT, countriesTouched, citiesLogged, discoveries, landmarks, mapData };
}

export function computeLeftRows(tree: ContinentData[]): LeftRow[] {
  const rows: LeftRow[] = [];
  tree.forEach((cn, i) =>
    cn.countries.forEach((co, j) =>
      co.cities.forEach((ct, k) => {
        const w = cityWeight(ct);
        if (!w.v) return;
        const p = pct(w);
        rows.push({
          name: ct.name,
          where: `${co.name} · ${cn.name}`,
          pct: fmtPct(p),
          bar: barWidth(p),
          open: `${ct.nt - ct.nv} neighbourhoods · ${ct.lt - ct.lv} landmarks`,
          disc: String(ct.disc.length),
          path: [i, j, k],
          sort: p,
        });
      }),
    ),
  );
  return rows.sort((a, b) => b.sort - a.sort);
}

/** The travel data and the figures derived from it, shared by every view. */
@Injectable({ providedIn: 'root' })
export class TravelStore {
  private readonly treeState = signal<ContinentData[]>(TRAVEL_TREE);

  readonly tree = this.treeState.asReadonly();
  readonly timeline = TIMELINE;

  readonly worldTotals = computed(() => computeWorldTotals(this.tree()));
  readonly worldPct = computed(() => {
    const t = this.worldTotals();
    return pct({ v: t.worldV, t: t.worldT });
  });
  /** Every visited city, closest to done first. */
  readonly leftRows = computed(() => computeLeftRows(this.tree()));

  /**
   * Path `[continent, country?, city?]` for URL slugs such as `['south-america', 'ecuador']`,
   * or null if any slug does not exist. No slugs gives the world (`[]`).
   */
  pathFromSlugs(slugs: string[]): number[] | null {
    const path: number[] = [];
    let level: { name: string }[] = this.tree();
    for (const slug of slugs) {
      const index = level.findIndex((place) => toSlug(place.name) === slug);
      if (index < 0) return null;
      path.push(index);
      const node = this.placeAt(path);
      level = 'countries' in node ? node.countries : 'cities' in node ? node.cities : [];
    }
    return path;
  }

  /** URL slugs for a path, the inverse of `pathFromSlugs`. */
  slugsFromPath(path: number[]): string[] {
    return path.map((_, i) => toSlug(this.placeAt(path.slice(0, i + 1)).name));
  }

  /** Display names for each level of a path, e.g. `['South America', 'Ecuador']`. */
  namesFromPath(path: number[]): string[] {
    return path.map((_, i) => this.placeAt(path.slice(0, i + 1)).name);
  }

  private placeAt(path: number[]) {
    const continent = this.tree()[path[0]];
    if (path.length === 1) return continent;
    const country = continent.countries[path[1]];
    if (path.length === 2) return country;
    return country.cities[path[2]];
  }

  /** Path `[continent, country]` for a country name as the map spells it, or null if unknown. */
  countryPathForMapName(mapName: string): number[] | null {
    const tree = this.tree();
    for (let i = 0; i < tree.length; i++) {
      const j = tree[i].countries.findIndex(
        (co) => co.name === mapName || MAP_COUNTRY_ALIAS[co.name] === mapName,
      );
      if (j >= 0) return [i, j];
    }
    return null;
  }
}
