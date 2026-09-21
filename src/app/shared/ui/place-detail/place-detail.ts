import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { DialogState } from '../../../core/dialog-state';

/**
 * Frame for a country or city detail page: flag, kicker and title on top, two columns below and a
 * "something wrong?" link at the bottom. Project the columns with `detail-main` and `detail-side`.
 */
@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.html',
  styleUrl: './place-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceDetail {
  protected readonly dialogs = inject(DialogState);

  /** CSS `url(...)` of the flag image. */
  readonly flag = input.required<string>();
  readonly kicker = input.required<string>();
  readonly title = input.required<string>();
  /** Large flag with the title beside it (countries) instead of above the columns (cities). */
  readonly large = input(false);
  /** Label of the place for the problem report, e.g. `Ecuador · Quito`. */
  readonly place = input.required<string>();
}
