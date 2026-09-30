import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DialogState } from '../../core/dialog-state';
import { I18n } from '../../core/i18n/i18n';
import { Dialog } from '../../shared/ui/dialog/dialog';

@Component({
  selector: 'app-photo-confirm-dialog',
  imports: [Dialog],
  templateUrl: './photo-confirm-dialog.html',
  styleUrl: './photo-confirm-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoConfirmDialog {
  protected readonly dialogs = inject(DialogState);
  protected readonly t = inject(I18n).t;

  /** Example detection until recognition is wired up. */
  protected readonly detection = {
    place: 'Basílica del Voto Nacional',
    city: 'Quito',
    taken: new Date(2026, 2, 14),
    metres: 140,
    confidence: '91%',
  };
}
