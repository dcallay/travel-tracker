import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { InfoButton } from '../info-button/info-button';
import { ProgressBar } from '../progress-bar/progress-bar';

/** The large percentage with its label, bar and formula, shown at the top of a detail view. */
@Component({
  selector: 'app-score-summary',
  imports: [InfoButton, ProgressBar],
  templateUrl: './score-summary.html',
  styleUrl: './score-summary.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreSummary {
  readonly pct = input.required<string>();
  readonly label = input.required<string>();
  readonly bar = input.required<string>();
  readonly formula = input.required<string>();
  readonly infoActivate = output<void>();
}
