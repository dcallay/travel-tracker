import { Injectable } from '@angular/core';

import { FeedbackKind, FeedbackTopic } from './dialog-state';
import { EN } from './i18n/en';

export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
/**
 * Web3Forms access key. Public by design: it can only deliver mail to the inbox it was created
 * for, so the worst anyone can do with it is send that inbox spam.
 */
const WEB3FORMS_KEY = 'f16df78b-01e8-4715-91ce-e3fd91666e02';

export interface FeedbackMessage {
  kind: FeedbackKind;
  /** Label of the place being reported on; empty when there is none. */
  place: string;
  /** Index into the report reasons; null for general feedback. */
  reason: number | null;
  /** What general feedback is about; null for a report. */
  topic: FeedbackTopic | null;
  message: string;
  /** Where to reply; empty when the user left none. */
  email: string;
  /** UI language the user was in, e.g. `es`. */
  locale: string;
  /** The app URL the user was looking at. */
  page: string;
}

/**
 * The JSON body Web3Forms expects. Reasons and topics go out in English so the inbox reads
 * consistently, and sit in the subject so it can be sorted at a glance.
 */
export function buildSubmission(msg: FeedbackMessage): Record<string, string> {
  const reason = msg.reason === null ? '' : (EN.feedback.reasons[msg.reason] ?? '');
  const topic = msg.topic === null ? '' : EN.feedback.topics[msg.topic];
  const subject =
    msg.kind === 'report'
      ? `GEOSCORE report: ${[msg.place, reason].filter(Boolean).join(' — ')}`
      : `GEOSCORE feedback${topic ? `: ${topic}` : ''}`;
  const body: Record<string, string> = {
    access_key: WEB3FORMS_KEY,
    subject,
    from_name: 'GEOSCORE',
    message: msg.message.trim() || '(no message)',
    page: msg.page,
    language: msg.locale,
  };
  if (msg.kind === 'report') {
    body['place'] = msg.place;
    body['reason'] = reason;
  } else if (topic) {
    body['topic'] = topic;
  }
  // Web3Forms uses `email` as the reply-to address.
  const email = msg.email.trim();
  if (email) body['email'] = email;
  return body;
}

/** Basic shape check, so a typo is caught before the message goes out without a way to reply. */
export function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Emails feedback through Web3Forms, straight from the browser. */
@Injectable({ providedIn: 'root' })
export class FeedbackMailer {
  /** Resolves once Web3Forms accepts the message; rejects on a network or service error. */
  async send(msg: FeedbackMessage): Promise<void> {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(buildSubmission(msg)),
    });
    const result = (await response.json().catch(() => null)) as {
      success?: boolean;
      message?: string;
    } | null;
    if (!response.ok || !result?.success) {
      throw new Error(result?.message ?? `Web3Forms responded ${response.status}`);
    }
  }
}
