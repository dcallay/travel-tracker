import { Injectable, signal } from '@angular/core';

export type FeedbackKind = 'general' | 'report';

export interface FeedbackRequest {
  kind: FeedbackKind;
  /** Label of the place being reported on, e.g. `Ecuador · Quito`; empty when there is none. */
  place: string;
}

/** Which app-level dialog is open. The dialog components render themselves from this. */
@Injectable({ providedIn: 'root' })
export class DialogState {
  readonly howOpen = signal(false);
  readonly detectionsOpen = signal(false);
  readonly feedback = signal<FeedbackRequest | null>(null);
  readonly feedbackSent = signal(false);

  openHow(): void {
    this.howOpen.set(true);
  }

  closeHow(): void {
    this.howOpen.set(false);
  }

  openDetections(): void {
    this.detectionsOpen.set(true);
  }

  closeDetections(): void {
    this.detectionsOpen.set(false);
  }

  openFeedback(): void {
    this.feedback.set({ kind: 'general', place: '' });
    this.feedbackSent.set(false);
  }

  openReport(place: string): void {
    this.feedback.set({ kind: 'report', place });
    this.feedbackSent.set(false);
  }

  /** Called once the message has actually been delivered. */
  markFeedbackSent(): void {
    this.feedbackSent.set(true);
  }

  closeFeedback(): void {
    this.feedback.set(null);
    this.feedbackSent.set(false);
  }
}
