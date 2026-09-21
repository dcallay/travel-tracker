import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  computed,
  input,
  output,
} from '@angular/core';

export interface CityMarker {
  name: string;
  lon: number;
  lat: number;
  visited: boolean;
  pct: number;
}

/**
 * Typed wrapper around the `<world-coverage-map>` custom element (public/world-coverage-map.js),
 * which only understands string attributes and reports clicks as a DOM event.
 *
 * - World / continent view: pass `data` (coverage % by country name) and optionally `fit`.
 * - Country view: pass `country` and `cities`.
 */
@Component({
  selector: 'app-coverage-map',
  templateUrl: './coverage-map.html',
  styleUrl: './coverage-map.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoverageMap {
  /** Coverage percentage keyed by the country name the map uses. */
  readonly data = input<Record<string, number>>();
  /** Continent name to zoom to; empty shows the whole world. */
  readonly fit = input<string>();
  readonly height = input(260);
  /** Country to zoom to and outline. */
  readonly country = input<string>();
  readonly cities = input<CityMarker[]>();

  /** The country name as the map spells it (e.g. `United States of America`). */
  readonly countrySelected = output<string>();

  protected readonly dataAttr = computed(() => this.toJson(this.data()));
  protected readonly citiesAttr = computed(() => this.toJson(this.cities()));

  protected onCountrySelect(event: Event): void {
    const name = (event as CustomEvent<{ name?: string }>).detail?.name;
    if (name) this.countrySelected.emit(name);
  }

  private toJson(value: unknown): string | null {
    return value === undefined ? null : JSON.stringify(value);
  }
}
