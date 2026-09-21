import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { InfoButton } from '../info-button/info-button';

@Component({
  selector: 'app-stat-tile',
  imports: [InfoButton],
  templateUrl: './stat-tile.html',
  styleUrl: './stat-tile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatTile {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly note = input.required<string>();
  /** Shows the ⓘ button next to the label. */
  readonly hasInfo = input(false);
  readonly infoActivate = output<void>();
}
