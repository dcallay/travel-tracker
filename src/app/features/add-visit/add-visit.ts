import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';

import { I18n } from '../../core/i18n/i18n';
import { Navigation } from '../../core/navigation';
import { NearbyCity, nearestCity } from '../../core/geo';
import { readPhotoMetadata } from '../../core/photo-metadata';

type Coverage = 'neighbourhood' | 'landmark' | 'discovery';

/** What the form learned from the chosen photo. */
interface PhotoFill {
  url: string;
  name: string;
  /** `null` while the file is still being read. */
  result: {
    date: Date;
    dateFrom: 'exif' | 'file';
    hasPosition: boolean;
    city: NearbyCity | null;
  } | null;
}

/** EXIF lives at the start of a JPEG; this is plenty to find it without reading the whole file. */
const METADATA_BYTES = 256 * 1024;

@Component({
  selector: 'app-add-visit',
  templateUrl: './add-visit.html',
  styleUrl: './add-visit.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddVisit {
  protected readonly navigation = inject(Navigation);
  protected readonly t = inject(I18n).t;

  protected readonly place = signal('Quito, Ecuador');
  protected readonly coverage = signal<Coverage>('neighbourhood');
  /** Example date the form is prefilled with. */
  protected readonly date = signal(new Date(2026, 8, 16));
  protected readonly photo = signal<PhotoFill | null>(null);
  protected readonly dragging = signal(false);

  /** Form values from before the photo filled them in, restored when it's removed. */
  private beforePhoto: { place: string; date: Date } | null = null;

  protected readonly source = computed(() => {
    const a = this.t().addVisit;
    const result = this.photo()?.result;
    if (!result) return a.source;
    return result.city ? a.sourcePhotoGps : a.sourcePhoto;
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => this.releasePreview());
  }

  protected onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (file) void this.usePhoto(file);
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(true);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file?.type.startsWith('image/')) void this.usePhoto(file);
  }

  protected removePhoto(): void {
    this.releasePreview();
    this.photo.set(null);
    if (this.beforePhoto) {
      this.place.set(this.beforePhoto.place);
      this.date.set(this.beforePhoto.date);
      this.beforePhoto = null;
    }
  }

  protected async usePhoto(file: File): Promise<void> {
    this.releasePreview();
    this.beforePhoto ??= { place: this.place(), date: this.date() };
    const fill: PhotoFill = { url: URL.createObjectURL(file), name: file.name, result: null };
    this.photo.set(fill);

    const meta = readPhotoMetadata(await file.slice(0, METADATA_BYTES).arrayBuffer());
    if (this.photo() !== fill) return; // replaced or removed while reading

    const city = meta.position ? nearestCity(meta.position) : null;
    const date = meta.takenAt ?? new Date(file.lastModified);
    this.date.set(date);
    if (city) this.place.set(`${city.city}, ${city.country}`);
    this.photo.set({
      ...fill,
      result: {
        date,
        dateFrom: meta.takenAt ? 'exif' : 'file',
        hasPosition: meta.position !== null,
        city,
      },
    });
  }

  private releasePreview(): void {
    const url = this.photo()?.url;
    if (url) URL.revokeObjectURL(url);
  }
}
