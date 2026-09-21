import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';

import { DialogState } from '../../core/dialog-state';
import { Crumb } from '../nav.model';
import { LangMenu } from './lang-menu/lang-menu';

@Component({
  selector: 'app-header',
  imports: [LangMenu],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly dialogs = inject(DialogState);

  readonly crumbs = input.required<Crumb[]>();
  /** Emitted with the path of the crumb the user picked. */
  readonly crumbSelected = output<number[]>();
  readonly addVisit = output<void>();
}
