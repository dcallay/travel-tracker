import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { I18n, Lang } from '../../../core/i18n/i18n';

const LANGS: [code: Lang, name: string][] = [
  ['EN', 'English'],
  ['ES', 'Español'],
  ['PT', 'Português'],
  ['FR', 'Français'],
  ['DE', 'Deutsch'],
];

@Component({
  selector: 'app-lang-menu',
  templateUrl: './lang-menu.html',
  styleUrl: './lang-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'open.set(false)' },
})
export class LangMenu {
  protected readonly langs = LANGS;
  protected readonly lang = inject(I18n).lang;
  protected readonly open = signal(false);

  protected toggle(): void {
    this.open.update((v) => !v);
  }

  protected select(code: Lang): void {
    this.lang.set(code);
    this.open.set(false);
  }
}
