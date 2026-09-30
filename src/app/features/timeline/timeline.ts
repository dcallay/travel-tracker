import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { TimelineEntry } from '../../core/data/travel-data';
import { parseSeedDate } from '../../core/i18n/dates';
import { I18n } from '../../core/i18n/i18n';
import { TravelStore } from '../../core/travel-store';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Timeline {
  private readonly timeline = inject(TravelStore).timeline;
  protected readonly t = inject(I18n).t;

  /** The seed entries with their date and labels in the chosen language. */
  protected readonly entries = computed(() => {
    const t = this.t();
    return this.timeline.map((entry) => {
      const date = parseSeedDate(entry.date);
      return {
        ...entry,
        date: date ? t.formatDate(date) : entry.date,
        detail: t.timeline.details[entry.detail] ?? entry.detail,
        weight: t.timeline.weights[entry.weight] ?? entry.weight,
        sourceLabel: t.timeline.sources[entry.source],
      };
    });
  });

  protected tagClass(source: TimelineEntry['source']): string {
    return source === 'Manual' ? 'tag tag-outline' : 'tag tag-accent';
  }
}
