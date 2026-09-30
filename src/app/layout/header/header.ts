import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DialogState } from '../../core/dialog-state';
import { I18n } from '../../core/i18n/i18n';
import { Crumb } from '../nav.model';
import { LangMenu } from './lang-menu/lang-menu';

@Component({
  selector: 'app-header',
  imports: [LangMenu, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly dialogs = inject(DialogState);
  protected readonly t = inject(I18n).t;

  readonly crumbs = input.required<Crumb[]>();
}
