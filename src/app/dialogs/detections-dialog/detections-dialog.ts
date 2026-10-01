import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { DialogState } from '../../core/dialog-state';
import { I18n } from '../../core/i18n/i18n';
import { Detection, LocationDetection } from '../../core/location-detection';
import { Dialog } from '../../shared/ui/dialog/dialog';

type Coverage = 'neighbourhood' | 'landmark' | 'discovery';

/** Turning automatic detection on, and confirming — or naming — the visits it found. */
@Component({
  selector: 'app-detections-dialog',
  imports: [Dialog],
  templateUrl: './detections-dialog.html',
  styleUrl: './detections-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetectionsDialog {
  protected readonly dialogs = inject(DialogState);
  protected readonly detection = inject(LocationDetection);
  protected readonly t = inject(I18n).t;

  protected readonly coverages: Coverage[] = ['neighbourhood', 'landmark', 'discovery'];
  /** What the user has typed for detections the app couldn't name, by detection id. */
  protected readonly answers = signal<Record<number, { name: string; coverage: Coverage }>>({});

  protected answer(d: Detection) {
    return this.answers()[d.id] ?? { name: '', coverage: 'discovery' as Coverage };
  }

  protected setAnswer(d: Detection, change: Partial<{ name: string; coverage: Coverage }>): void {
    this.answers.update((all) => ({ ...all, [d.id]: { ...this.answer(d), ...change } }));
  }

  protected save(d: Detection): void {
    const { name, coverage } = this.answer(d);
    this.detection.confirm(d.id, { name: name.trim(), coverage });
  }

  protected time(ms: number): string {
    return new Date(ms).toLocaleTimeString(this.t().locale, { hour: '2-digit', minute: '2-digit' });
  }

  protected readonly round = Math.round;

  protected turnOn(): void {
    this.detection.enable();
  }

  protected turnOff(): void {
    this.detection.disable();
    this.dialogs.closeDetections();
  }
}
