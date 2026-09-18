import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, OnDestroy, OnInit, computed, signal } from '@angular/core';

import {
  CITY_GEO,
  CityData,
  CountryData,
  TIMELINE,
  TRAVEL_TREE,
  flagImageUrl,
} from '../data/travel-data';
import { barWidth, cityWeight, continentWeight, countryWeight, fmtPct, pct } from '../data/travel-calc';

type NavId = 'explore' | 'left' | 'timeline' | 'add';
type FeedbackKind = 'general' | 'report' | null;

interface Row {
  name: string;
  meta: string;
  pct: string;
  bar: string;
  barColor: string;
  fg: string;
  path: number[] | null;
}

interface StatTile {
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
  stats: StatTile[];
  emptyNote: string;
  mapFit: string;
  mapHeight: number;
  mapCaption: string;
  mapData: string;
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
  citiesGeo: string;
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

interface LeftRow {
  name: string;
  where: string;
  pct: string;
  bar: string;
  open: string;
  disc: string;
  path: number[];
  sort: number;
}

const LANGS: [string, string][] = [
  ['EN', 'English'],
  ['ES', 'Español'],
  ['PT', 'Português'],
  ['FR', 'Français'],
  ['DE', 'Deutsch'],
];

const COUNTRY_ALIAS: Record<string, string> = { 'United States': 'United States of America' };

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Home implements OnInit, OnDestroy {
  protected readonly metricLabel = 'Explored';
  protected readonly metricLower = this.metricLabel.toLowerCase();
  protected readonly timeline = TIMELINE;

  protected readonly nav = signal<NavId>('explore');
  protected readonly path = signal<number[]>([]);

  protected readonly lang = signal('EN');
  protected readonly langOpen = signal(false);
  protected readonly lksOpen = signal(false);
  protected readonly howOpen = signal(false);
  protected readonly photoDialogOpen = signal(false);
  protected readonly fb = signal<FeedbackKind>(null);
  protected readonly fbSent = signal(false);

  private readonly onCountrySelect = (event: Event): void => {
    const hit = (event as CustomEvent<{ name?: string }>).detail?.name ?? '';
    TRAVEL_TREE.forEach((cn, i) =>
      cn.countries.forEach((co, j) => {
        if (co.name === hit || COUNTRY_ALIAS[co.name] === hit) this.go([i, j]);
      }),
    );
  };

  ngOnInit(): void {
    document.addEventListener('country-select', this.onCountrySelect);
  }

  ngOnDestroy(): void {
    document.removeEventListener('country-select', this.onCountrySelect);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.howOpen.set(false);
    this.photoDialogOpen.set(false);
    this.langOpen.set(false);
    this.fb.set(null);
    this.fbSent.set(false);
  }

  protected readonly isListView = computed(() => this.nav() === 'explore' && this.path().length < 2);
  protected readonly isCountryView = computed(() => this.nav() === 'explore' && this.path().length === 2);
  protected readonly isCityView = computed(() => this.nav() === 'explore' && this.path().length === 3);

  protected readonly navItems = computed(() => {
    const nav = this.nav();
    const defs: { id: NavId; label: string; count: string }[] = [
      { id: 'explore', label: 'Explore', count: `${TRAVEL_TREE.length} continents` },
      { id: 'left', label: "What's left", count: `${this.leftRows().length} places` },
      { id: 'timeline', label: 'Timeline', count: `${TIMELINE.length} recent` },
    ];
    return defs.map((d) => ({ ...d, active: nav === d.id }));
  });

  protected readonly crumbs = computed<Crumb[]>(() => {
    const path = this.path();
    const labels: string[] = ['World'];
    if (path[0] != null) labels.push(TRAVEL_TREE[path[0]].name);
    if (path[1] != null) labels.push(TRAVEL_TREE[path[0]].countries[path[1]].name);
    if (path[2] != null) labels.push(TRAVEL_TREE[path[0]].countries[path[1]].cities[path[2]].name);
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

  private readonly worldTotals = computed(() => {
    let worldV = 0;
    let worldT = 0;
    let countriesTouched = 0;
    let citiesLogged = 0;
    let discoveries = 0;
    let landmarks = 0;
    const mapData: Record<string, number> = {};
    TRAVEL_TREE.forEach((cn) => {
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
  });

  protected readonly worldPct = computed(() => {
    const t = this.worldTotals();
    return pct({ v: t.worldV, t: t.worldT });
  });

  protected readonly worldFootnote = computed(() => {
    const t = this.worldTotals();
    return `${t.countriesTouched} countries · ${t.citiesLogged} cities · ${t.discoveries} discoveries`;
  });

  private mkRow(name: string, meta: string, p: number, next: number[] | null): Row {
    return {
      name,
      meta,
      pct: fmtPct(p),
      bar: barWidth(p),
      barColor: p === 0 ? 'var(--color-neutral-400)' : 'var(--color-accent)',
      fg: p === 0 ? 'var(--color-neutral-600)' : 'var(--color-text)',
      path: next,
    };
  }

  protected readonly listView = computed<ListViewModel>(() => {
    const path = this.path();
    const metricLower = this.metricLower;
    const totals = this.worldTotals();
    const mapDataJson = JSON.stringify(totals.mapData);

    if (path.length === 0) {
      const rows = TRAVEL_TREE.map((cn, i) => {
        const w = continentWeight(cn);
        const touched = cn.countries.filter((co) => countryWeight(co).v > 0).length;
        return this.mkRow(
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
          { label: `World ${metricLower}`, value: fmtPct(this.worldPct()), note: `${totals.worldV} of ${totals.worldT} weighted places`, hasInfo: true },
          { label: 'Countries touched', value: String(totals.countriesTouched), note: 'across the world', hasInfo: false },
          { label: 'Cities logged', value: String(totals.citiesLogged), note: `${totals.landmarks} landmarks checked off`, hasInfo: false },
          { label: 'Your discoveries', value: String(totals.discoveries), note: 'local knowledge score', hasInfo: false },
        ],
        emptyNote: '',
        mapFit: '',
        mapHeight: 250,
        mapCaption: `Countries shaded by ${metricLower} — click one for its detail`,
        mapData: mapDataJson,
      };
    }

    const cn = TRAVEL_TREE[path[0]];
    const w = continentWeight(cn);
    const rows = cn.countries.map((co, i) => {
      const cwt = countryWeight(co);
      const logged = co.cities.filter((ct) => cityWeight(ct).v > 0).length;
      return this.mkRow(
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
      mapData: mapDataJson,
    };
  });

  protected readonly countryView = computed<CountryViewModel | null>(() => {
    const path = this.path();
    if (path.length !== 2) return null;
    const cn = TRAVEL_TREE[path[0]];
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
        const row = this.mkRow(
          ct.name,
          cwt.v ? `${ct.nv} neighbourhoods · ${ct.lv} landmarks · ${ct.last}` : 'Not yet visited',
          cp,
          [path[0], path[1], i],
        );
        return { row, cp };
      })
      .sort((a, b) => b.cp - a.cp)
      .map(({ row }) => row);
    const citiesGeo = co.cities.map((ct: CityData) => {
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
      citiesGeo: JSON.stringify(citiesGeo),
    };
  });

  protected readonly cityView = computed<CityViewModel | null>(() => {
    const path = this.path();
    if (path.length !== 3) return null;
    const cn = TRAVEL_TREE[path[0]];
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

  protected readonly leftRows = computed<LeftRow[]>(() => {
    const rows: LeftRow[] = [];
    TRAVEL_TREE.forEach((cn, i) =>
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
  });

  protected readonly parentScore = computed(() => {
    const path = this.path();
    const metricLower = this.metricLower;
    if (this.nav() !== 'explore' || path.length === 0) return null;
    if (path.length === 1) {
      const t = this.worldTotals();
      return {
        label: `World ${metricLower}`,
        pct: fmtPct(this.worldPct()),
        bar: barWidth(this.worldPct()),
        note: `${t.worldV} of ${t.worldT} weighted places`,
      };
    }
    if (path.length === 2) {
      const cn = TRAVEL_TREE[path[0]];
      const w = continentWeight(cn);
      const p = pct(w);
      return {
        label: `${cn.name} ${metricLower}`,
        pct: fmtPct(p),
        bar: barWidth(p),
        note: `${w.v} of ${w.t} weighted places · ${cn.countries.length} countries`,
      };
    }
    const cn = TRAVEL_TREE[path[0]];
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

  protected readonly feedback = computed(() => {
    const kind = this.fb();
    const sent = this.fbSent();
    const placeLabel = this.placeLabel();
    const isReport = kind === 'report';
    return {
      kicker: isReport ? 'Report a problem' : 'Feedback',
      title: sent ? 'Thanks — it is logged' : isReport ? 'Something wrong here?' : 'Send feedback',
      thanks:
        isReport && placeLabel
          ? `Logged against ${placeLabel} with your current view. We look at reports weekly and correct the place data at the source.`
          : 'Logged with your current view. We read everything, and reply when you leave an email.',
      hasPlace: isReport && !!placeLabel,
      place: placeLabel,
      fieldLabel: isReport ? 'What did you expect to see?' : 'Would you like to tell us?',
      placeholder: isReport ? 'e.g. Guápulo is in Quito, not Cuenca' : 'Anything — a bug, a missing city, an idea',
      isReport,
    };
  });

  protected tagClass(source: string): string {
    return source === 'Manual' ? 'tag tag-outline' : 'tag tag-accent';
  }

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

  protected toggleLks(): void {
    this.lksOpen.update((v) => !v);
  }

  protected openHow(): void {
    this.howOpen.set(true);
  }

  protected closeHow(): void {
    this.howOpen.set(false);
  }

  protected openPhotoDialog(): void {
    this.photoDialogOpen.set(true);
  }

  protected closePhotoDialog(): void {
    this.photoDialogOpen.set(false);
  }

  protected openFeedback(): void {
    this.fb.set('general');
    this.fbSent.set(false);
  }

  protected openReport(): void {
    this.fb.set('report');
    this.fbSent.set(false);
  }

  protected closeFeedback(): void {
    this.fb.set(null);
    this.fbSent.set(false);
  }

  protected sendFeedback(): void {
    this.fbSent.set(true);
  }

  protected goAdd(): void {
    this.nav.set('add');
  }

  protected goExplore(): void {
    this.nav.set('explore');
  }
}
