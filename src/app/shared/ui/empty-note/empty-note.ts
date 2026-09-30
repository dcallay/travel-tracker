import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { I18n } from '../../../core/i18n/i18n';

@Component({
  selector: 'app-empty-note',
  templateUrl: './empty-note.html',
  styleUrl: './empty-note.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyNote {
  protected readonly t = inject(I18n).t;

  readonly note = input.required<string>();
}
