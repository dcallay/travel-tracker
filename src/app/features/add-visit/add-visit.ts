import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-add-visit',
  templateUrl: './add-visit.html',
  styleUrl: './add-visit.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddVisit {
  /** Emitted when the form is saved or cancelled. */
  readonly finished = output<void>();
}
