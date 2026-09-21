import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface BreakdownCell {
  label: string;
  value: string;
  note: string;
  /** Set when the label should hyphenate in that language (needs `lang` for `hyphens: auto`). */
  lang?: string;
}

/** A row of labelled ratios, e.g. neighbourhoods / landmarks visited against what is on file. */
@Component({
  selector: 'app-score-breakdown',
  templateUrl: './score-breakdown.html',
  styleUrl: './score-breakdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreBreakdown {
  readonly cells = input.required<BreakdownCell[]>();

  protected readonly columns = computed(() => `repeat(${this.cells().length}, minmax(0, 1fr))`);
}
