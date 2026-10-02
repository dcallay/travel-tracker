import { TestBed } from '@angular/core/testing';

import {
  FeedbackMailer,
  FeedbackMessage,
  WEB3FORMS_ENDPOINT,
  buildSubmission,
  looksLikeEmail,
} from './feedback-mailer';

const general: FeedbackMessage = {
  kind: 'general',
  place: '',
  reason: null,
  topic: 'build',
  message: '  Love the map  ',
  email: '',
  locale: 'en',
  page: '/explore',
};

const report: FeedbackMessage = {
  kind: 'report',
  place: 'Ecuador · Quito',
  reason: 1,
  topic: null,
  message: '',
  email: ' ana@example.com ',
  locale: 'es',
  page: '/explore/south-america/ecuador/quito',
};

describe('buildSubmission', () => {
  it('sends general feedback with a plain subject and no reply-to', () => {
    const body = buildSubmission(general);
    expect(body['access_key']).toMatch(/^[0-9a-f-]{36}$/);
    expect(body['subject']).toBe('GEOSCORE feedback: Build this');
    expect(body['topic']).toBe('Build this');
    expect(body['message']).toBe('Love the map');
    expect(body['page']).toBe('/explore');
    expect(body['language']).toBe('en');
    expect(body).not.toHaveProperty('email');
    expect(body).not.toHaveProperty('place');
  });

  it('labels the topic in English whatever language the user was in', () => {
    const body = buildSubmission({ ...general, topic: 'like', locale: 'es' });
    expect(body['subject']).toBe('GEOSCORE feedback: I like this');
    expect(body['topic']).toBe('I like this');
  });

  it('names the place and the reason, in English, on a report', () => {
    const body = buildSubmission(report);
    expect(body['subject']).toBe('GEOSCORE report: Ecuador · Quito — Wrong city');
    expect(body['place']).toBe('Ecuador · Quito');
    expect(body['reason']).toBe('Wrong city');
    expect(body['message']).toBe('(no message)');
    expect(body['email']).toBe('ana@example.com');
    expect(body['language']).toBe('es');
    expect(body).not.toHaveProperty('topic');
  });
});

describe('looksLikeEmail', () => {
  it('accepts ordinary addresses and rejects obvious typos', () => {
    expect(looksLikeEmail('ana@example.com')).toBe(true);
    expect(looksLikeEmail(' ana@example.co.uk ')).toBe(true);
    expect(looksLikeEmail('ana@example')).toBe(false);
    expect(looksLikeEmail('ana example.com')).toBe(false);
  });
});

describe('FeedbackMailer', () => {
  const respond = (status: number, json: unknown) =>
    vi.fn().mockResolvedValue(new Response(JSON.stringify(json), { status }));

  afterEach(() => vi.unstubAllGlobals());

  it('posts the submission to Web3Forms as JSON', async () => {
    const fetch = respond(200, { success: true });
    vi.stubGlobal('fetch', fetch);
    await TestBed.inject(FeedbackMailer).send(general);
    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe(WEB3FORMS_ENDPOINT);
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual(buildSubmission(general));
  });

  it('rejects when Web3Forms refuses the message', async () => {
    vi.stubGlobal('fetch', respond(400, { success: false, message: 'Invalid access key' }));
    await expect(TestBed.inject(FeedbackMailer).send(general)).rejects.toThrow(
      'Invalid access key',
    );
  });

  it('rejects on a network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(TestBed.inject(FeedbackMailer).send(general)).rejects.toThrow();
  });
});
