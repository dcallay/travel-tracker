import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';

import { I18n } from '../../../core/i18n/i18n';

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

  protected readonly t = inject(I18n).t;
  protected readonly open = signal(false);

  protected toggle(): void {
    this.open.update((v) => !v);
  }
}
