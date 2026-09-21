import { Component, HostListener, computed, inject, signal } from '@angular/core';

import { barWidth, cityWeight, continentWeight, countryWeight, fmtPct, pct } from '../data/travel-calc';
import { DialogState } from '../core/dialog-state';
import { METRIC_LOWER } from '../core/metric';
import { TravelStore } from '../core/travel-store';
import { FeedbackDialog } from '../dialogs/feedback-dialog/feedback-dialog';
import { HowItWorksDialog } from '../dialogs/how-it-works-dialog/how-it-works-dialog';
import { PhotoConfirmDialog } from '../dialogs/photo-confirm-dialog/photo-confirm-dialog';
import { AddVisit } from '../features/add-visit/add-visit';
import { CityDetail } from '../features/explore/city-detail/city-detail';
import { CountryDetail } from '../features/explore/country-detail/country-detail';
import { ExploreList } from '../features/explore/explore-list/explore-list';
import { Timeline } from '../features/timeline/timeline';
import { WhatsLeft } from '../features/whats-left/whats-left';
import { ProgressBar } from '../shared/ui/progress-bar/progress-bar';

type NavId = 'explore' | 'left' | 'timeline' | 'add';

interface Crumb {
  label: string;
  sep: string;
  active: boolean;
  path: number[];
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
    CityDetail,
    CountryDetail,
    ExploreList,
    FeedbackDialog,
    HowItWorksDialog,
    PhotoConfirmDialog,
    ProgressBar,
    Timeline,
    WhatsLeft,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly store = inject(TravelStore);
  protected readonly dialogs = inject(DialogState);
  protected readonly metricLower = METRIC_LOWER;
  protected readonly leftRows = this.store.leftRows;

  protected readonly nav = signal<NavId>('explore');
  protected readonly path = signal<number[]>([]);

  protected readonly lang = signal('EN');
  protected readonly langOpen = signal(false);

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
