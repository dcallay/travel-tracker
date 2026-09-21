import { ChangeDetectionStrategy, Component, output } from '@angular/core';

/**
 * Modal shell: backdrop plus panel. Projects its content into the panel and asks to be dismissed
 * on Escape or a click outside the panel. The parent decides whether to actually close.
 * Panel and content styles (`.dialog`, `.dialog-title`, …) are global, in styles.scss.
 */
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'dismissed.emit()' },
})
export class Dialog {
  readonly dismissed = output<void>();
}
