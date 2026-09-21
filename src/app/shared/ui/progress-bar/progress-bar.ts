import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBar {
  /** CSS width of the filled part, e.g. `42.5%`. */
  readonly width = input.required<string>();
  /** Overrides the fill colour; defaults to the accent colour. */
  readonly color = input<string>();
  readonly size = input<'sm' | 'lg'>('sm');
}
