import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ProgressBar } from '../progress-bar/progress-bar';

/** A progress bar with its percentage beside it, for a table cell. */
@Component({
  selector: 'app-coverage-cell',
  imports: [ProgressBar],
  templateUrl: './coverage-cell.html',
  styleUrl: './coverage-cell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoverageCell {
  readonly bar = input.required<string>();
  readonly pct = input.required<string>();
  readonly color = input<string>();
}
