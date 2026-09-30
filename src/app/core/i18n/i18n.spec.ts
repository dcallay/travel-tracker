import { TestBed } from '@angular/core/testing';

import { I18n } from './i18n';
import { EN } from './en';
import { ES } from './es';

describe('I18n', () => {
  let i18n: I18n;

  beforeEach(() => {
    i18n = TestBed.inject(I18n);
  });

  it('starts in English', () => {
    expect(i18n.t()).toBe(EN);
    expect(i18n.t().placeMetric('Ecuador')).toBe('Ecuador explored');
  });

  it('switches to Spanish with its own word order', () => {
    i18n.lang.set('ES');
    expect(i18n.t()).toBe(ES);
    expect(i18n.t().placeMetric('Ecuador')).toBe('Explorado en Ecuador');
  });
});
