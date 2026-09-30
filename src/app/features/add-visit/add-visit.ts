import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { I18n } from '../../core/i18n/i18n';
import { Navigation } from '../../core/navigation';

@Component({
  selector: 'app-add-visit',
  templateUrl: './add-visit.html',
  styleUrl: './add-visit.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddVisit {
  protected readonly navigation = inject(Navigation);
  protected readonly t = inject(I18n).t;
}
