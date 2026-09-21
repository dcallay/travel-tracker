import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { METRIC_LOWER } from '../../core/metric';
import { Navigation } from '../../core/navigation';
import { TravelStore } from '../../core/travel-store';
import { barWidth, continentWeight, countryWeight, fmtPct, pct } from '../../data/travel-calc';
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

  protected readonly navItems = computed<NavItem[]>(() => [
    { label: 'Explore', count: `${this.store.tree().length} continents`, link: '/explore' },
    { label: "What's left", count: `${this.store.leftRows().length} places`, link: '/left' },
    { label: 'Timeline', count: `${this.store.timeline.length} recent`, link: '/timeline' },
  ]);

  protected readonly crumbs = computed<Crumb[]>(() => {
    const path = this.navigation.path();
    const isExplore = this.navigation.section() === 'explore';
    const labels = ['World', ...this.store.namesFromPath(path)];
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
    if (path.length === 0) return null;
    if (path.length === 1) {
      const t = this.store.worldTotals();
      return {
        label: `World ${METRIC_LOWER}`,
        pct: fmtPct(this.store.worldPct()),
        bar: barWidth(this.store.worldPct()),
        note: `${t.worldV} of ${t.worldT} weighted places`,
      };
    }
    const cn = tree[path[0]];
    if (path.length === 2) {
      const w = continentWeight(cn);
      const p = pct(w);
      return {
        label: `${cn.name} ${METRIC_LOWER}`,
        pct: fmtPct(p),
        bar: barWidth(p),
        note: `${w.v} of ${w.t} weighted places · ${cn.countries.length} countries`,
      };
    }
    const co = cn.countries[path[1]];
    const w = countryWeight(co);
    const p = pct(w);
    return {
      label: `${co.name} ${METRIC_LOWER}`,
      pct: fmtPct(p),
      bar: barWidth(p),
      note: `${w.v} of ${w.t} weighted places · ${co.cities.length} cities on file`,
    };
  });
}
