import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DialogState } from '../../core/dialog-state';
import { I18n } from '../../core/i18n/i18n';
import { Dialog } from '../../shared/ui/dialog/dialog';

@Component({
  selector: 'app-how-it-works-dialog',
  imports: [Dialog],
  templateUrl: './how-it-works-dialog.html',
  styleUrl: './how-it-works-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowItWorksDialog {
  protected readonly dialogs = inject(DialogState);
  protected readonly t = inject(I18n).t;
}
