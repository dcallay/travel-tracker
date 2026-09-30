import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { fmtPct } from '../../../core/data/travel-calc';
import { flagUrlForCode } from '../../../core/data/travel-data';
import { I18n } from '../../../core/i18n/i18n';
import { TopCountryRow } from '../../../core/travel-store';
import { CoverageCell } from '../coverage-cell/coverage-cell';
import { StatTile } from '../stat-tile/stat-tile';

export interface PublicProfileData {
  name: string;
  home: string;
  /** ISO 3166-1 alpha-2 code, lower case. */
  nationality: string;
  isPublic: boolean;
  /** World explored, as a percentage. */
  explored: number;
  countries: number;
  cities: number;
  rank: number;
  total: number;
  /** Most explored countries, or null when not on file. */
  topCountries: TopCountryRow[] | null;
}

/** A traveller's public profile card: who they are and their headline stats. */
@Component({
  selector: 'app-public-profile',
  imports: [CoverageCell, StatTile],
  templateUrl: './public-profile.html',
  styleUrl: './public-profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicProfile {
  protected readonly t = inject(I18n).t;
  protected readonly flagUrl = flagUrlForCode;

  readonly profile = input.required<PublicProfileData>();
  /** Shows the stats of a private profile too, dimmed, as its owner sees it. */
  readonly preview = input(false);

  protected readonly showStats = computed(() => this.profile().isPublic || this.preview());

  protected readonly countryName = computed(() => {
    const code = this.profile().nationality.toUpperCase();
    return new Intl.DisplayNames([this.t().locale], { type: 'region' }).of(code) ?? code;
  });

  protected readonly stats = computed(() => {
    const p = this.profile();
    const t = this.t();
    return [
      { label: t.metric, value: fmtPct(p.explored), note: t.account.exploredNote },
      { label: t.leaderboard.countries, value: String(p.countries), note: t.stats.acrossTheWorld },
      { label: t.leaderboard.cities, value: String(p.cities), note: t.account.citiesNote },
      { label: t.sidebar.leaderboard, value: `#${p.rank}`, note: t.account.rankNote(p.total) },
    ];
  });
}
