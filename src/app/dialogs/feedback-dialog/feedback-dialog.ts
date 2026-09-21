import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { DialogState } from '../../core/dialog-state';
import { Dialog } from '../../shared/ui/dialog/dialog';

@Component({
  selector: 'app-feedback-dialog',
  imports: [Dialog],
  templateUrl: './feedback-dialog.html',
  styleUrl: './feedback-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackDialog {
  protected readonly dialogs = inject(DialogState);

  protected readonly copy = computed(() => {
    const request = this.dialogs.feedback();
    if (!request) return null;
    const isReport = request.kind === 'report';
    const hasPlace = isReport && !!request.place;
    const sent = this.dialogs.feedbackSent();
    return {
      isReport,
      hasPlace,
      place: request.place,
      kicker: isReport ? 'Report a problem' : 'Feedback',
      title: sent ? 'Thanks — it is logged' : isReport ? 'Something wrong here?' : 'Send feedback',
      thanks: hasPlace
        ? `Logged against ${request.place} with your current view. We look at reports weekly and correct the place data at the source.`
        : 'Logged with your current view. We read everything, and reply when you leave an email.',
      fieldLabel: isReport ? 'What did you expect to see?' : 'Would you like to tell us?',
      placeholder: isReport
        ? 'e.g. Guápulo is in Quito, not Cuenca'
        : 'Anything — a bug, a missing city, an idea',
    };
  });
}
