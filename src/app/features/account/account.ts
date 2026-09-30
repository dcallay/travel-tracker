import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { fmtPct } from '../../core/data/travel-calc';
import { flagUrlForCode } from '../../core/data/travel-data';
import { I18n, Lang } from '../../core/i18n/i18n';
import { NATIONALITIES, Profile, ProfileData } from '../../core/profile';
import { TravelStore } from '../../core/travel-store';
import { CoverageCell } from '../../shared/ui/coverage-cell/coverage-cell';
import { SectionHead } from '../../shared/ui/section-head/section-head';
import { StatTile } from '../../shared/ui/stat-tile/stat-tile';

const LANGS: [code: Lang, name: string][] = [
  ['EN', 'English'],
  ['ES', 'Español'],
];

@Component({
  selector: 'app-account',
  imports: [CoverageCell, SectionHead, StatTile],
  templateUrl: './account.html',
  styleUrl: './account.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Account {
  private readonly store = inject(TravelStore);
  private readonly i18n = inject(I18n);
  protected readonly profile = inject(Profile).data;
  protected readonly t = this.i18n.t;
  protected readonly langs = LANGS;
  protected readonly flagUrl = flagUrlForCode;
  protected readonly topCountries = this.store.topCountries;

  /** Unsaved edits to the settings form. */
  protected readonly draft = signal<ProfileData & { lang: Lang }>(this.saved());
  protected readonly justSaved = signal(false);

  protected readonly dirty = computed(
    () => JSON.stringify(this.draft()) !== JSON.stringify(this.saved()),
  );
  protected readonly nameMissing = computed(() => !this.draft().name.trim());

  private readonly regionNames = computed(
    () => new Intl.DisplayNames([this.t().locale], { type: 'region' }),
  );

  /** Nationalities sorted by their name in the UI language. */
  protected readonly nationalities = computed(() =>
    NATIONALITIES.map((code) => ({ code, name: this.countryName(code) })).sort((a, b) =>
      a.name.localeCompare(b.name, this.t().locale),
    ),
  );

  protected readonly stats = computed(() => {
    const t = this.t();
    const totals = this.store.worldTotals();
    const board = this.store.leaderboard();
    const world = this.store.worldPct();
    return [
      { label: t.worldMetric, value: fmtPct(world), note: t.weightedPlaces(totals.worldV, totals.worldT) },
      { label: t.stats.countriesTouched, value: String(totals.countriesTouched), note: t.stats.acrossTheWorld },
      { label: t.stats.citiesLogged, value: String(totals.citiesLogged), note: t.stats.landmarksCheckedOff(totals.landmarks) },
      { label: t.sidebar.leaderboard, value: `#${board.you.rank}`, note: t.account.rankNote(board.total) },
    ];
  });

  protected countryName(code: string): string {
    return this.regionNames().of(code.toUpperCase()) ?? code.toUpperCase();
  }

  protected edit(changes: Partial<ProfileData & { lang: Lang }>): void {
    this.draft.update((d) => ({ ...d, ...changes }));
    this.justSaved.set(false);
  }

  protected save(): void {
    if (this.nameMissing()) return;
    const { lang, ...profile } = this.draft();
    this.profile.set({ ...profile, name: profile.name.trim(), home: profile.home.trim() });
    this.i18n.lang.set(lang);
    this.draft.set(this.saved());
    this.justSaved.set(true);
  }

  protected discard(): void {
    this.draft.set(this.saved());
    this.justSaved.set(false);
  }

  private saved(): ProfileData & { lang: Lang } {
    return { ...this.profile(), lang: this.i18n.lang() };
  }
}
