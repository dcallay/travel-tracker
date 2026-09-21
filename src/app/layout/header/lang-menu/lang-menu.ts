import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

const LANGS: [code: string, name: string][] = [
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
  protected readonly lang = signal('EN');
  protected readonly open = signal(false);

  protected toggle(): void {
    this.open.update((v) => !v);
  }

  protected select(code: string): void {
    this.lang.set(code);
    this.open.set(false);
  }
}
