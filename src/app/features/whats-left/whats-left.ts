import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { I18n } from '../../core/i18n/i18n';
import { Navigation } from '../../core/navigation';
import { TravelStore } from '../../core/travel-store';
import { CoverageCell } from '../../shared/ui/coverage-cell/coverage-cell';

@Component({
  selector: 'app-whats-left',
  imports: [CoverageCell],
  templateUrl: './whats-left.html',
  styleUrl: './whats-left.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhatsLeft {
  protected readonly navigation = inject(Navigation);
  protected readonly rows = inject(TravelStore).leftRows;
  protected readonly t = inject(I18n).t;
}
