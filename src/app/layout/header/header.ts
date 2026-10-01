import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DialogState } from '../../core/dialog-state';
import { I18n } from '../../core/i18n/i18n';
import { LocationDetection } from '../../core/location-detection';
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

  protected readonly detection = inject(LocationDetection);

  readonly crumbs = input.required<Crumb[]>();

  protected readonly detectLabel = computed(() => {
    const b = this.t().detect.button;
    const pending = this.detection.pending().length;
    const status = this.detection.status();
    if (pending) return b.pending(pending);
    return status === 'on' ? b.on : b[status];
  });
}
