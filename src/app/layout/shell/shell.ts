import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { METRIC_LOWER } from '../../core/metric';
import { TravelStore } from '../../core/travel-store';
import { barWidth, cityWeight, continentWeight, countryWeight, fmtPct, pct } from '../../data/travel-calc';
import { FeedbackDialog } from '../../dialogs/feedback-dialog/feedback-dialog';
import { HowItWorksDialog } from '../../dialogs/how-it-works-dialog/how-it-works-dialog';
import { PhotoConfirmDialog } from '../../dialogs/photo-confirm-dialog/photo-confirm-dialog';
import { AddVisit } from '../../features/add-visit/add-visit';
import { CityDetail } from '../../features/explore/city-detail/city-detail';
import { CountryDetail } from '../../features/explore/country-detail/country-detail';
import { ExploreList } from '../../features/explore/explore-list/explore-list';
import { Timeline } from '../../features/timeline/timeline';
import { WhatsLeft } from '../../features/whats-left/whats-left';
import { Header } from '../header/header';
import { Crumb, NavId, NavItem, ParentScore } from '../nav.model';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-shell',
  imports: [
    AddVisit,
    CityDetail,
    CountryDetail,
    ExploreList,
    FeedbackDialog,
    Header,
    HowItWorksDialog,
    PhotoConfirmDialog,
    Sidebar,
    Timeline,
    WhatsLeft,
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {
  private readonly store = inject(TravelStore);

  protected readonly nav = signal<NavId>('explore');
  protected readonly path = signal<number[]>([]);

  protected readonly isListView = computed(() => this.nav() === 'explore' && this.path().length < 2);
  protected readonly isCountryView = computed(() => this.nav() === 'explore' && this.path().length === 2);
  protected readonly isCityView = computed(() => this.nav() === 'explore' && this.path().length === 3);

  protected readonly navItems = computed<NavItem[]>(() => {
    const nav = this.nav();
    const defs: Omit<NavItem, 'active'>[] = [
      { id: 'explore', label: 'Explore', count: `${this.store.tree().length} continents` },
      { id: 'left', label: "What's left", count: `${this.store.leftRows().length} places` },
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

  protected readonly parentScore = computed<ParentScore | null>(() => {
    const path = this.path();
    const metricLower = METRIC_LOWER;
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

  protected goAdd(): void {
    this.nav.set('add');
  }

  protected goExplore(): void {
    this.nav.set('explore');
  }
}
