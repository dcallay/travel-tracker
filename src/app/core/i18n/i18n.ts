import { Injectable, computed, signal } from '@angular/core';

import { EN } from './en';
import { ES } from './es';
import { Strings } from './strings';

export type Lang = 'EN' | 'ES';

const DICTIONARIES: Record<Lang, Strings> = { EN, ES };

/** The chosen UI language and its strings. */
@Injectable({ providedIn: 'root' })
export class I18n {
  readonly lang = signal<Lang>('EN');
  readonly t = computed(() => DICTIONARIES[this.lang()]);
}
