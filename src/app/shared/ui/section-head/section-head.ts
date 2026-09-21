import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** A small uppercase label with a note on the right, ruled underneath. Heads a list. */
@Component({
  selector: 'app-section-head',
  templateUrl: './section-head.html',
  styleUrl: './section-head.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHead {
  readonly label = input.required<string>();
  readonly note = input.required<string>();
}
