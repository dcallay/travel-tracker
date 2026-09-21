import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DialogState } from '../../core/dialog-state';
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
}
