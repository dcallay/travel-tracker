import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { barWidth, fmtPct } from '../../core/data/travel-calc';
import { flagUrlForCode } from '../../core/data/travel-data';
import { I18n } from '../../core/i18n/i18n';
import { toSlug } from '../../core/slug';
import { TravelStore } from '../../core/travel-store';
import { CoverageCell } from '../../shared/ui/coverage-cell/coverage-cell';
import { StatTile } from '../../shared/ui/stat-tile/stat-tile';

@Component({
  selector: 'app-leaderboard',
  imports: [CoverageCell, NgTemplateOutlet, RouterLink, StatTile],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Leaderboard {
  protected readonly board = inject(TravelStore).leaderboard;
  protected readonly t = inject(I18n).t;
  protected readonly barWidth = barWidth;
  protected readonly fmtPct = fmtPct;
  protected readonly flagUrl = flagUrlForCode;
  protected readonly toSlug = toSlug;

  /** Country names in the UI language, for the flags' labels. */
  private readonly regionNames = computed(
    () => new Intl.DisplayNames([this.t().locale], { type: 'region' }),
  );

  protected countryName(code: string): string {
    return this.regionNames().of(code.toUpperCase()) ?? code.toUpperCase();
  }

  protected readonly stats = computed(() => {
    const { you, total, aheadOfPct } = this.board();
    const l = this.t().leaderboard;
    return [
      { label: l.yourRank, value: `#${you.rank}`, note: l.ofTravellers(total) },
      { label: l.aheadOf, value: `${aheadOfPct}%`, note: l.aheadOfNote },
      { label: l.countries, value: String(you.countries), note: l.countriesNote },
      { label: l.cities, value: String(you.cities), note: l.citiesNote },
    ];
  });
}
