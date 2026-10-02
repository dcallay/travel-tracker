import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal } from '@angular/core';
import { Router } from '@angular/router';

import { DialogState, FEEDBACK_TOPICS, FeedbackTopic } from '../../core/dialog-state';
import { FeedbackMailer, looksLikeEmail } from '../../core/feedback-mailer';
import { I18n } from '../../core/i18n/i18n';
import { Dialog } from '../../shared/ui/dialog/dialog';

type SendState = 'idle' | 'sending' | 'error';

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
  private readonly mailer = inject(FeedbackMailer);
  private readonly router = inject(Router);

  // Form state starts over each time the dialog opens with a new request.
  protected readonly message = linkedSignal({
    source: this.dialogs.feedback,
    computation: () => '',
  });
  protected readonly email = linkedSignal({ source: this.dialogs.feedback, computation: () => '' });
  protected readonly reason = linkedSignal({ source: this.dialogs.feedback, computation: () => 0 });
  protected readonly topic = linkedSignal<unknown, FeedbackTopic>({
    source: this.dialogs.feedback,
    computation: () => FEEDBACK_TOPICS[0],
  });
  protected readonly topics = FEEDBACK_TOPICS;
  /** Honeypot: hidden from people, ticked by bots that fill in every field. */
  protected readonly botcheck = linkedSignal({
    source: this.dialogs.feedback,
    computation: () => false,
  });
  protected readonly state = linkedSignal<unknown, SendState>({
    source: this.dialogs.feedback,
    computation: () => 'idle',
  });

  protected readonly emailInvalid = computed(() => {
    const email = this.email().trim();
    return email !== '' && !looksLikeEmail(email);
  });

  /** A report's reason or an "I like this" says something alone; anything else needs a message. */
  protected readonly canSend = computed(
    () =>
      this.state() !== 'sending' &&
      !this.emailInvalid() &&
      (this.dialogs.feedback()?.kind === 'report' ||
        this.topic() === 'like' ||
        this.message().trim() !== ''),
  );

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
      placeholder: isReport ? f.reportPlaceholder : f.placeholders[this.topic()],
    };
  });

  protected async send(): Promise<void> {
    const request = this.dialogs.feedback();
    if (!request || !this.canSend()) return;
    if (this.botcheck()) {
      this.dialogs.markFeedbackSent(); // look sent, send nothing
      return;
    }
    this.state.set('sending');
    try {
      await this.mailer.send({
        kind: request.kind,
        place: request.place,
        reason: request.kind === 'report' ? this.reason() : null,
        topic: request.kind === 'general' ? this.topic() : null,
        message: this.message(),
        email: this.email(),
        locale: this.t().locale,
        page: this.router.url,
      });
      if (this.dialogs.feedback() === request) this.dialogs.markFeedbackSent();
    } catch {
      if (this.dialogs.feedback() === request) this.state.set('error');
    }
  }
}
