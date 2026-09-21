import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import { DialogState } from '../../../core/dialog-state';
import { METRIC_LABEL, METRIC_LOWER } from '../../../core/metric';
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
  protected readonly dialogs = inject(DialogState);
  protected readonly metricLabel = METRIC_LABEL;
  protected readonly metricLower = METRIC_LOWER;

  /** `[continent, country]`. */
  readonly path = input.required<number[]>();
  /** Emitted with the path of the city (or map country) the user picked. */
  readonly navigate = output<number[]>();

  protected readonly view = computed(() => buildCountryView(this.store.tree(), this.path()));

  protected onCountrySelect(mapName: string): void {
    const path = this.store.countryPathForMapName(mapName);
    if (path) this.navigate.emit(path);
  }
}
