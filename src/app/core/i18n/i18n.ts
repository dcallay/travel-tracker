import { Injectable, computed, signal } from '@angular/core';

import { EN, ES, Strings } from './strings';

export type Lang = 'EN' | 'ES' | 'PT' | 'FR' | 'DE';

/** Languages without a translation yet fall back to English. */
const DICTIONARIES: Partial<Record<Lang, Strings>> = { EN, ES };

/** The chosen UI language and its strings. */
@Injectable({ providedIn: 'root' })
export class I18n {
  readonly lang = signal<Lang>('EN');
  readonly t = computed(() => DICTIONARIES[this.lang()] ?? EN);
}
