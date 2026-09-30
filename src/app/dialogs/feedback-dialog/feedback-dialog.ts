import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { DialogState } from '../../core/dialog-state';
import { I18n } from '../../core/i18n/i18n';
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
  protected readonly t = inject(I18n).t;

  protected readonly copy = computed(() => {
    const request = this.dialogs.feedback();
    if (!request) return null;
    const isReport = request.kind === 'report';
    const hasPlace = isReport && !!request.place;
    const sent = this.dialogs.feedbackSent();
    const t = this.t();
    const f = t.feedback;
    return {
      isReport,
      hasPlace,
      place: request.place,
      kicker: isReport ? f.reportKicker : f.kicker,
      title: sent ? f.sentTitle : isReport ? t.detail.reportLink : t.sidebar.sendFeedback,
      thanks: hasPlace ? f.reportThanks(request.place) : f.thanks,
      fieldLabel: isReport ? f.reportFieldLabel : f.fieldLabel,
      placeholder: isReport ? f.reportPlaceholder : f.placeholder,
    };
  });
}
