import { TestBed } from '@angular/core/testing';

import { DialogState } from './dialog-state';

describe('DialogState', () => {
  let state: DialogState;

  beforeEach(() => {
    state = TestBed.inject(DialogState);
  });

  it('opens and closes the method and detection dialogs independently', () => {
    state.openHow();
    state.openDetections();
    expect(state.howOpen()).toBe(true);
    expect(state.detectionsOpen()).toBe(true);

    state.closeHow();
    expect(state.howOpen()).toBe(false);
    expect(state.detectionsOpen()).toBe(true);
  });

  it('opens general feedback without a place', () => {
    state.openFeedback();
    expect(state.feedback()).toEqual({ kind: 'general', place: '' });
  });

  it('opens a report against a place and clears a previous "sent" state', () => {
    state.openFeedback();
    state.markFeedbackSent();
    expect(state.feedbackSent()).toBe(true);

    state.openReport('Ecuador · Quito');
    expect(state.feedback()).toEqual({ kind: 'report', place: 'Ecuador · Quito' });
    expect(state.feedbackSent()).toBe(false);
  });

  it('resets feedback fully when closed', () => {
    state.openReport('Peru · Lima');
    state.markFeedbackSent();
    state.closeFeedback();
    expect(state.feedback()).toBeNull();
    expect(state.feedbackSent()).toBe(false);
  });
});
