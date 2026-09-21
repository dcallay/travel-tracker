import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-info-button',
  templateUrl: './info-button.html',
  styleUrl: './info-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoButton {
  readonly label = input('How the score is calculated');
  readonly size = input(15);
  readonly activate = output<void>();
}
