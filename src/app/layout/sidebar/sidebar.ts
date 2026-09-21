import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { DialogState } from '../../core/dialog-state';
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

  readonly items = input.required<NavItem[]>();
  readonly parentScore = input<ParentScore | null>(null);
}
