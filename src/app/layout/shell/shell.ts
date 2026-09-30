import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { I18n } from '../../core/i18n/i18n';
import { Navigation } from '../../core/navigation';
import { Profile } from '../../core/profile';
import { TravelStore } from '../../core/travel-store';
import { barWidth, continentWeight, countryWeight, fmtPct, pct } from '../../core/data/travel-calc';
import { FeedbackDialog } from '../../dialogs/feedback-dialog/feedback-dialog';
import { HowItWorksDialog } from '../../dialogs/how-it-works-dialog/how-it-works-dialog';
import { PhotoConfirmDialog } from '../../dialogs/photo-confirm-dialog/photo-confirm-dialog';
import { Header } from '../header/header';
import { Crumb, NavItem, ParentScore } from '../nav.model';
import { Sidebar } from '../sidebar/sidebar';

/** The app frame: sidebar, header and the routed view, plus the app-level dialogs. */
@Component({
  selector: 'app-shell',
  imports: [FeedbackDialog, Header, HowItWorksDialog, PhotoConfirmDialog, RouterOutlet, Sidebar],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {
  private readonly store = inject(TravelStore);
  private readonly navigation = inject(Navigation);
  private readonly i18n = inject(I18n);
  private readonly profile = inject(Profile).data;

  protected readonly navItems = computed<NavItem[]>(() => {
    const t = this.i18n.t().sidebar;
    return [
      { label: t.explore, count: t.exploreCount(this.store.tree().length), link: '/explore' },
      { label: t.whatsLeft, count: t.whatsLeftCount(this.store.leftRows().length), link: '/left' },
      { label: t.timeline, count: t.timelineCount(this.store.timeline.length), link: '/timeline' },
      {
        label: t.leaderboard,
        count: t.leaderboardCount(this.store.leaderboard().total),
        link: '/leaderboard',
      },
      { label: t.account, count: this.profile().name, link: '/account' },
    ];
  });

  protected readonly crumbs = computed<Crumb[]>(() => {
    const path = this.navigation.path();
    const isExplore = this.navigation.section() === 'explore';
    const labels = [this.i18n.t().header.world, ...this.store.namesFromPath(path)];
    return labels.map((label, i) => ({
      label,
      sep: i < labels.length - 1 ? '/' : '',
      active: i === labels.length - 1 && isExplore,
      link: this.navigation.commands(path.slice(0, i)),
    }));
  });

  /** The score of the level above the one on screen; the world has no parent. */
  protected readonly parentScore = computed<ParentScore | null>(() => {
    const path = this.navigation.path();
    const tree = this.store.tree();
    const t = this.i18n.t();
    if (path.length === 0) return null;
    if (path.length === 1) {
      const totals = this.store.worldTotals();
      return {
        label: t.worldMetric,
        pct: fmtPct(this.store.worldPct()),
        bar: barWidth(this.store.worldPct()),
        note: t.weightedPlaces(totals.worldV, totals.worldT),
      };
    }
    const cn = tree[path[0]];
    if (path.length === 2) {
      const w = continentWeight(cn);
      const p = pct(w);
      return {
        label: t.placeMetric(cn.name),
        pct: fmtPct(p),
        bar: barWidth(p),
        note: `${t.weightedPlaces(w.v, w.t)} · ${t.sidebar.countries(cn.countries.length)}`,
      };
    }
    const co = cn.countries[path[1]];
    const w = countryWeight(co);
    const p = pct(w);
    return {
      label: t.placeMetric(co.name),
      pct: fmtPct(p),
      bar: barWidth(p),
      note: `${t.weightedPlaces(w.v, w.t)} · ${t.sidebar.citiesOnFile(co.cities.length)}`,
    };
  });
}
