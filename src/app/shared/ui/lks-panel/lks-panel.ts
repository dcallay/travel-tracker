import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

/** The Local Knowledge Score with an expandable list of the personal discoveries behind it. */
@Component({
  selector: 'app-lks-panel',
  templateUrl: './lks-panel.html',
  styleUrl: './lks-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LksPanel {
  readonly count = input.required<string>();
  readonly items = input.required<string[]>();
  /** Explanatory line shown above the list when expanded. */
  readonly note = input.required<string>();

  protected readonly open = signal(false);

  protected toggle(): void {
    this.open.update((v) => !v);
  }
}
