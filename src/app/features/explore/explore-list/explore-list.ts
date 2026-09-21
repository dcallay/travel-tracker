import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import { DialogState } from '../../../core/dialog-state';
import { METRIC_LABEL } from '../../../core/metric';
import { TravelStore } from '../../../core/travel-store';
import { CoverageCell } from '../../../shared/ui/coverage-cell/coverage-cell';
import { CoverageMap } from '../../../shared/ui/coverage-map/coverage-map';
import { EmptyNote } from '../../../shared/ui/empty-note/empty-note';
import { StatTile } from '../../../shared/ui/stat-tile/stat-tile';
import { buildListView } from './list-view';

/** The world or a single continent: headline stats, a shaded map and a table to drill into. */
@Component({
  selector: 'app-explore-list',
  imports: [CoverageCell, CoverageMap, EmptyNote, StatTile],
  templateUrl: './explore-list.html',
  styleUrl: './explore-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreList {
  private readonly store = inject(TravelStore);
  protected readonly dialogs = inject(DialogState);
  protected readonly metricLabel = METRIC_LABEL;

  /** `[]` for the world, `[continent]` for a continent. */
  readonly path = input.required<number[]>();
  /** Emitted with the path of the row (or map country) the user picked. */
  readonly navigate = output<number[]>();

  protected readonly view = computed(() =>
    buildListView(this.store.tree(), this.store.worldTotals(), this.path()),
  );

  protected onCountrySelect(mapName: string): void {
    const path = this.store.countryPathForMapName(mapName);
    if (path) this.navigate.emit(path);
  }
}
