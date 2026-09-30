import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { DialogState } from '../../../core/dialog-state';
import { I18n } from '../../../core/i18n/i18n';
import { Navigation } from '../../../core/navigation';
import { TravelStore } from '../../../core/travel-store';
import { CoverageMap } from '../../../shared/ui/coverage-map/coverage-map';
import { EmptyNote } from '../../../shared/ui/empty-note/empty-note';
import { LksPanel } from '../../../shared/ui/lks-panel/lks-panel';
import { PlaceDetail } from '../../../shared/ui/place-detail/place-detail';
import { ProgressBar } from '../../../shared/ui/progress-bar/progress-bar';
import { ScoreBreakdown } from '../../../shared/ui/score-breakdown/score-breakdown';
import { ScoreSummary } from '../../../shared/ui/score-summary/score-summary';
import { SectionHead } from '../../../shared/ui/section-head/section-head';
import { buildCountryView } from './country-view';

@Component({
  selector: 'app-country-detail',
  imports: [
    CoverageMap,
    EmptyNote,
    LksPanel,
    PlaceDetail,
    ProgressBar,
    ScoreBreakdown,
    ScoreSummary,
    SectionHead,
  ],
  templateUrl: './country-detail.html',
  styleUrl: './country-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryDetail {
  private readonly store = inject(TravelStore);
  protected readonly navigation = inject(Navigation);
  protected readonly dialogs = inject(DialogState);
  protected readonly t = inject(I18n).t;

  /** `[continent, country]`. */
  readonly path = input.required<number[]>();

  protected readonly view = computed(() =>
    buildCountryView(this.store.tree(), this.path(), this.t()),
  );

  protected onCountrySelect(mapName: string): void {
    const path = this.store.countryPathForMapName(mapName);
    if (path) this.navigation.goTo(path);
  }
}
