import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-note',
  templateUrl: './empty-note.html',
  styleUrl: './empty-note.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyNote {
  readonly note = input.required<string>();
}
