import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import { I18n } from '../../../core/i18n/i18n';

@Component({
  selector: 'app-info-button',
  templateUrl: './info-button.html',
  styleUrl: './info-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoButton {
  private readonly t = inject(I18n).t;

  /** Defaults to the title of the how-it-works dialog. */
  readonly label = input<string>();
  readonly size = input(15);
  readonly activate = output<void>();

  protected readonly text = computed(() => this.label() ?? this.t().how.title);
}
