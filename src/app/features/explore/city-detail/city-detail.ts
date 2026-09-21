import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { DialogState } from '../../../core/dialog-state';
import { METRIC_LABEL, METRIC_LOWER } from '../../../core/metric';
import { TravelStore } from '../../../core/travel-store';
import { LksPanel } from '../../../shared/ui/lks-panel/lks-panel';
import { PlaceDetail } from '../../../shared/ui/place-detail/place-detail';
import { ScoreBreakdown } from '../../../shared/ui/score-breakdown/score-breakdown';
import { ScoreSummary } from '../../../shared/ui/score-summary/score-summary';
import { SectionHead } from '../../../shared/ui/section-head/section-head';
import { buildCityView } from './city-view';

@Component({
  selector: 'app-city-detail',
  imports: [LksPanel, PlaceDetail, ScoreBreakdown, ScoreSummary, SectionHead],
  templateUrl: './city-detail.html',
  styleUrl: './city-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityDetail {
  private readonly store = inject(TravelStore);
  protected readonly dialogs = inject(DialogState);
  protected readonly metricLabel = METRIC_LABEL;
  protected readonly metricLower = METRIC_LOWER;

  /** `[continent, country, city]`. */
  readonly path = input.required<number[]>();

  protected readonly view = computed(() => buildCityView(this.store.tree(), this.path()));
}
