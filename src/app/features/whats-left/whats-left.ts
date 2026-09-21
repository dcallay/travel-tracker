import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';

import { METRIC_LABEL } from '../../core/metric';
import { TravelStore } from '../../core/travel-store';
import { CoverageCell } from '../../shared/ui/coverage-cell/coverage-cell';

@Component({
  selector: 'app-whats-left',
  imports: [CoverageCell],
  templateUrl: './whats-left.html',
  styleUrl: './whats-left.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhatsLeft {
  protected readonly rows = inject(TravelStore).leftRows;
  protected readonly metricLabel = METRIC_LABEL;

  /** Emitted with the path of the city the user picked. */
  readonly navigate = output<number[]>();
}
