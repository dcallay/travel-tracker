import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { DialogState } from '../../../core/dialog-state';
import { I18n } from '../../../core/i18n/i18n';
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
  protected readonly t = inject(I18n).t;

  /** `[continent, country, city]`. */
  readonly path = input.required<number[]>();

  protected readonly view = computed(() => buildCityView(this.store.tree(), this.path(), this.t()));
}
