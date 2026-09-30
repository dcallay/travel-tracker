import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { DialogState } from '../../core/dialog-state';
import { I18n } from '../../core/i18n/i18n';
import { ProgressBar } from '../../shared/ui/progress-bar/progress-bar';
import { NavItem, ParentScore } from '../nav.model';

@Component({
  selector: 'app-sidebar',
  imports: [ProgressBar, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  protected readonly dialogs = inject(DialogState);
  protected readonly t = inject(I18n).t;

  readonly items = input.required<NavItem[]>();
  readonly parentScore = input<ParentScore | null>(null);
}
