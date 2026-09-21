import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DialogState } from '../../core/dialog-state';
import { METRIC_LOWER } from '../../core/metric';
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
  protected readonly metricLower = METRIC_LOWER;
}
