import { Component, HostListener, computed, inject, signal } from '@angular/core';

import { CITY_GEO, CityData, CountryData, flagImageUrl } from '../data/travel-data';
import { barWidth, cityWeight, continentWeight, countryWeight, fmtPct, pct } from '../data/travel-calc';
import { DialogState } from '../core/dialog-state';
import { METRIC_LABEL, METRIC_LOWER } from '../core/metric';
import { Row, toRow } from '../core/place-row';
import { TravelStore } from '../core/travel-store';
import { FeedbackDialog } from '../dialogs/feedback-dialog/feedback-dialog';
import { HowItWorksDialog } from '../dialogs/how-it-works-dialog/how-it-works-dialog';
import { PhotoConfirmDialog } from '../dialogs/photo-confirm-dialog/photo-confirm-dialog';
import { AddVisit } from '../features/add-visit/add-visit';
import { Timeline } from '../features/timeline/timeline';
import { CityMarker, CoverageMap } from '../shared/ui/coverage-map/coverage-map';
import { EmptyNote } from '../shared/ui/empty-note/empty-note';
import { LksPanel } from '../shared/ui/lks-panel/lks-panel';
import { ProgressBar } from '../shared/ui/progress-bar/progress-bar';
import { ScoreBreakdown } from '../shared/ui/score-breakdown/score-breakdown';
import { ScoreSummary } from '../shared/ui/score-summary/score-summary';
import { StatTile } from '../shared/ui/stat-tile/stat-tile';

type NavId = 'explore' | 'left' | 'timeline' | 'add';

interface StatItem {
  label: string;
  value: string;
  note: string;
  hasInfo: boolean;
}

interface Crumb {
  label: string;
  sep: string;
  active: boolean;
  path: number[];
}

interface ListViewModel {
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

interface CountryViewModel {
  name: string;
  kicker: string;
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
  cities: Row[];
  isEmpty: boolean;
  emptyNote: string;
  citiesGeo: CityMarker[];
}

interface CityViewModel {
  name: string;
  kicker: string;
  flag: string;
  pct: string;
  bar: string;
  formula: string;
  nRatio: string;
  lRatio: string;
  discCount: string;
  discList: string[];
  openCount: string;
  openList: { name: string; kind: string }[];
}

const LANGS: [string, string][] = [
  ['EN', 'English'],
  ['ES', 'Español'],
  ['PT', 'Português'],
  ['FR', 'Français'],
  ['DE', 'Deutsch'],
];

@Component({
  selector: 'app-home',
  imports: [
    AddVisit,
    CoverageMap,
    EmptyNote,
    FeedbackDialog,
    HowItWorksDialog,
    LksPanel,
    PhotoConfirmDialog,
    ProgressBar,
    ScoreBreakdown,
    ScoreSummary,
    StatTile,
    Timeline,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly store = inject(TravelStore);
  protected readonly dialogs = inject(DialogState);
  protected readonly metricLabel = METRIC_LABEL;
  protected readonly metricLower = METRIC_LOWER;
  protected readonly leftRows = this.store.leftRows;

  protected readonly nav = signal<NavId>('explore');
  protected readonly path = signal<number[]>([]);

  protected readonly lang = signal('EN');
  protected readonly langOpen = signal(false);

  protected onCountrySelect(mapName: string): void {
    const path = this.store.countryPathForMapName(mapName);
    if (path) this.go(path);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.langOpen.set(false);
  }

  protected readonly isListView = computed(() => this.nav() === 'explore' && this.path().length < 2);
  protected readonly isCountryView = computed(() => this.nav() === 'explore' && this.path().length === 2);
  protected readonly isCityView = computed(() => this.nav() === 'explore' && this.path().length === 3);

  protected readonly navItems = computed(() => {
    const nav = this.nav();
    const defs: { id: NavId; label: string; count: string }[] = [
      { id: 'explore', label: 'Explore', count: `${this.store.tree().length} continents` },
      { id: 'left', label: "What's left", count: `${this.leftRows().length} places` },
      { id: 'timeline', label: 'Timeline', count: `${this.store.timeline.length} recent` },
    ];
    return defs.map((d) => ({ ...d, active: nav === d.id }));
  });

  protected readonly crumbs = computed<Crumb[]>(() => {
    const path = this.path();
    const labels: string[] = ['World'];
    if (path[0] != null) labels.push(this.store.tree()[path[0]].name);
    if (path[1] != null) labels.push(this.store.tree()[path[0]].countries[path[1]].name);
    if (path[2] != null) labels.push(this.store.tree()[path[0]].countries[path[1]].cities[path[2]].name);
    return labels.map((label, i) => ({
      label,
      sep: i < labels.length - 1 ? '/' : '',
      active: i === labels.length - 1 && this.nav() === 'explore',
      path: path.slice(0, i),
    }));
  });

  protected readonly langs = computed(() =>
    LANGS.map(([code, name]) => ({ code, name, active: code === this.lang() })),
  );

  protected readonly listView = computed<ListViewModel>(() => {
    const path = this.path();
    const metricLower = this.metricLower;
    const totals = this.store.worldTotals();

    if (path.length === 0) {
      const rows = this.store.tree().map((cn, i) => {
        const w = continentWeight(cn);
        const touched = cn.countries.filter((co) => countryWeight(co).v > 0).length;
        return toRow(
          cn.name,
          touched ? `${touched} of ${cn.countries.length} countries` : 'No visits yet',
          pct(w),
          [i],
        );
      });
      return {
        rows,
        colHead: 'Continent',
        levelTitle: 'By continent',
        levelSub: 'Landmarks count double neighbourhoods',
        stats: [
          { label: `World ${metricLower}`, value: fmtPct(this.store.worldPct()), note: `${totals.worldV} of ${totals.worldT} weighted places`, hasInfo: true },
          { label: 'Countries touched', value: String(totals.countriesTouched), note: 'across the world', hasInfo: false },
          { label: 'Cities logged', value: String(totals.citiesLogged), note: `${totals.landmarks} landmarks checked off`, hasInfo: false },
          { label: 'Your discoveries', value: String(totals.discoveries), note: 'local knowledge score', hasInfo: false },
        ],
        emptyNote: '',
        mapFit: '',
        mapHeight: 250,
        mapCaption: `Countries shaded by ${metricLower} — click one for its detail`,
        mapData: totals.mapData,
      };
    }

    const cn = this.store.tree()[path[0]];
    const w = continentWeight(cn);
    const rows = cn.countries.map((co, i) => {
      const cwt = countryWeight(co);
      const logged = co.cities.filter((ct) => cityWeight(ct).v > 0).length;
      return toRow(
        co.name,
        logged ? `${logged} of ${co.cities.length} cities logged` : 'No visits yet',
        pct(cwt),
        [path[0], i],
      );
    });
    const discoveries = cn.countries.reduce((a, co) => a + co.cities.reduce((b, ct) => b + ct.disc.length, 0), 0);
    const citiesLogged = cn.countries.reduce((a, co) => a + co.cities.filter((ct) => cityWeight(ct).v > 0).length, 0);
    return {
      rows,
      colHead: 'Country',
      levelTitle: cn.name,
      levelSub: `${cn.countries.length} countries on file`,
      stats: [
        { label: `${cn.name} ${metricLower}`, value: fmtPct(pct(w)), note: `${w.v} of ${w.t} weighted places`, hasInfo: true },
        { label: 'Countries', value: String(cn.countries.length), note: `${cn.countries.filter((co) => countryWeight(co).v > 0).length} with visits`, hasInfo: false },
        { label: 'Cities logged', value: String(citiesLogged), note: 'in this continent', hasInfo: false },
        { label: 'Your discoveries', value: String(discoveries), note: 'local knowledge score', hasInfo: false },
      ],
      emptyNote:
        w.v === 0
          ? `Nothing logged in ${cn.name} yet. ${cn.countries.length} countries and ${w.t} weighted places are already on file, so the moment you land somewhere the percentage starts moving.`
          : '',
      mapFit: cn.name,
      mapHeight: 360,
      mapCaption: `${cn.name} — shaded by ${metricLower}, click a country for its detail`,
      mapData: totals.mapData,
    };
  });

  protected readonly countryView = computed<CountryViewModel | null>(() => {
    const path = this.path();
    if (path.length !== 2) return null;
    const cn = this.store.tree()[path[0]];
    const co: CountryData = cn.countries[path[1]];
    const w = countryWeight(co);
    const p = pct(w);
    const nv = co.cities.reduce((a, ct) => a + ct.nv, 0);
    const nt = co.cities.reduce((a, ct) => a + ct.nt, 0);
    const lv = co.cities.reduce((a, ct) => a + ct.lv, 0);
    const lt = co.cities.reduce((a, ct) => a + ct.lt, 0);
    const logged = co.cities.filter((ct) => cityWeight(ct).v > 0).length;
    const disc: string[] = [];
    co.cities.forEach((ct) => ct.disc.forEach((d) => disc.push(`${ct.name} — ${d}`)));
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
    const citiesGeo: CityMarker[] = co.cities.map((ct: CityData) => {
      const g = CITY_GEO[ct.name] ?? [0, 0];
      return { name: ct.name, lon: g[0], lat: g[1], visited: cityWeight(ct).v > 0, pct: pct(cityWeight(ct)) };
    });

    return {
      name: co.name,
      kicker: cn.name,
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
  });

  protected readonly cityView = computed<CityViewModel | null>(() => {
    const path = this.path();
    if (path.length !== 3) return null;
    const cn = this.store.tree()[path[0]];
    const co = cn.countries[path[1]];
    const ct = co.cities[path[2]];
    const w = cityWeight(ct);
    const p = pct(w);
    const openN = ct.nt - ct.nv;
    const openL = ct.lt - ct.lv;
    return {
      name: ct.name,
      kicker: `${co.name} · ${cn.name}`,
      flag: flagImageUrl(co.name),
      pct: fmtPct(p),
      bar: barWidth(p),
      formula: `${w.v} of ${w.t} weighted places. ${ct.nv} neighbourhoods at weight 1, ${ct.lv} landmarks at weight 2.`,
      nRatio: `${ct.nv} / ${ct.nt}`,
      lRatio: `${ct.lv} / ${ct.lt}`,
      discCount: String(ct.disc.length),
      discList: ct.disc.length ? ct.disc : ['Nothing logged here yet'],
      openCount: `${openN} neighbourhoods · ${openL} landmarks`,
      openList: ct.open.length ? ct.open : [{ name: `${openN} neighbourhoods and ${openL} landmarks not itemised yet`, kind: 'Seed data' }],
    };
  });

  protected readonly parentScore = computed(() => {
    const path = this.path();
    const metricLower = this.metricLower;
    if (this.nav() !== 'explore' || path.length === 0) return null;
    if (path.length === 1) {
      const t = this.store.worldTotals();
      return {
        label: `World ${metricLower}`,
        pct: fmtPct(this.store.worldPct()),
        bar: barWidth(this.store.worldPct()),
        note: `${t.worldV} of ${t.worldT} weighted places`,
      };
    }
    if (path.length === 2) {
      const cn = this.store.tree()[path[0]];
      const w = continentWeight(cn);
      const p = pct(w);
      return {
        label: `${cn.name} ${metricLower}`,
        pct: fmtPct(p),
        bar: barWidth(p),
        note: `${w.v} of ${w.t} weighted places · ${cn.countries.length} countries`,
      };
    }
    const cn = this.store.tree()[path[0]];
    const co = cn.countries[path[1]];
    const w = countryWeight(co);
    const p = pct(w);
    return {
      label: `${co.name} ${metricLower}`,
      pct: fmtPct(p),
      bar: barWidth(p),
      note: `${w.v} of ${w.t} weighted places · ${co.cities.length} cities on file`,
    };
  });

  protected readonly placeLabel = computed(() => {
    const city = this.cityView();
    if (city) return `${city.kicker.split(' · ')[0]} · ${city.name}`;
    const country = this.countryView();
    if (country) return `${country.kicker} · ${country.name}`;
    return '';
  });

  protected go(path: number[]): void {
    this.nav.set('explore');
    this.path.set(path);
  }

  protected selectNav(id: NavId): void {
    this.nav.set(id);
    this.path.set([]);
  }

  protected toggleLang(): void {
    this.langOpen.update((v) => !v);
  }

  protected selectLang(code: string): void {
    this.lang.set(code);
    this.langOpen.set(false);
  }

  protected goAdd(): void {
    this.nav.set('add');
  }

  protected goExplore(): void {
    this.nav.set('explore');
  }
}
