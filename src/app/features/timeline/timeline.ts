import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TravelStore } from '../../core/travel-store';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Timeline {
  protected readonly entries = inject(TravelStore).timeline;

  protected tagClass(source: string): string {
    return source === 'Manual' ? 'tag tag-outline' : 'tag tag-accent';
  }
}
