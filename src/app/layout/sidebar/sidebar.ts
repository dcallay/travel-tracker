import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';

import { DialogState } from '../../core/dialog-state';
import { ProgressBar } from '../../shared/ui/progress-bar/progress-bar';
import { NavId, NavItem, ParentScore } from '../nav.model';

@Component({
  selector: 'app-sidebar',
  imports: [ProgressBar],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  protected readonly dialogs = inject(DialogState);

  readonly items = input.required<NavItem[]>();
  readonly parentScore = input<ParentScore | null>(null);
  readonly navSelected = output<NavId>();
}
