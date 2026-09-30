import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { barWidth, fmtPct } from '../../core/data/travel-calc';
import { flagUrlForCode } from '../../core/data/travel-data';
import { I18n } from '../../core/i18n/i18n';
import { toSlug } from '../../core/slug';
import { TravelStore } from '../../core/travel-store';
import {
  PublicProfile,
  PublicProfileData,
} from '../../shared/ui/public-profile/public-profile';

/** Another traveller's public profile, opened from the leaderboard. */
@Component({
  selector: 'app-traveller',
  imports: [PublicProfile, RouterLink],
  templateUrl: './traveller.html',
  styleUrl: './traveller.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TravellerPage {
  private readonly board = inject(TravelStore).leaderboard;
  protected readonly t = inject(I18n).t;

  /** From the `:slug` route parameter. */
  readonly slug = input.required<string>();

  protected readonly profile = computed<PublicProfileData | null>(() => {
    const { all, total } = this.board();
    const row = all.find((r) => !r.isYou && toSlug(r.name) === this.slug());
    if (!row) return null;
    const regions = new Intl.DisplayNames([this.t().locale], { type: 'region' });
    return {
      name: row.name,
      home: row.home,
      nationality: row.nationality,
      isPublic: !row.isPrivate,
      explored: row.explored,
      countries: row.countries,
      cities: row.cities,
      rank: row.rank,
      total,
      topCountries:
        row.topCountries?.map(({ code, explored }) => ({
          name: regions.of(code.toUpperCase()) ?? code.toUpperCase(),
          flag: flagUrlForCode(code),
          pct: fmtPct(explored),
          bar: barWidth(explored),
        })) ?? null,
    };
  });
}
