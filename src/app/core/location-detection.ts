import { DestroyRef, Injectable, inject, signal } from '@angular/core';

import { SAVED_PLACES, SavedPlace } from './data/saved-places';
import { GeoPosition, NearbyCity, haversineKm, nearestCity } from './geo';
import { Strings } from './i18n/strings';

/** One location reading from the browser. */
export interface Fix {
  position: GeoPosition;
  /** Radius of uncertainty, in metres. */
  accuracy: number;
  /** Epoch milliseconds. */
  time: number;
}

/** A stay worth asking the user about. */
export interface Detection {
  id: number;
  start: Date;
  minutes: number;
  position: GeoPosition;
  /** The saved place the stay matched, or null when the app couldn't tell — then the user is asked. */
  place: SavedPlace | null;
  /** Closest city on file, if any is near. */
  city: NearbyCity | null;
  /** The user said the matched place was wrong, so it is now a question. */
  rejected: boolean;
}

export type DetectionStatus = 'off' | 'starting' | 'on' | 'denied' | 'unavailable';

/** Fixes vaguer than this can't place you in a landmark, so they're ignored. */
export const MAX_ACCURACY_M = 150;
/** How long you need to stay somewhere before it counts as a visit rather than passing by. */
export const DWELL_MS = 5 * 60_000;
/** Without a saved place to anchor to, fixes this close together are the same stay. */
export const STAY_RADIUS_M = 150;
/** A gap this long between fixes (app closed, phone asleep) starts a new stay. */
const MAX_GAP_MS = 20 * 60_000;

const STORAGE_KEY = 'tt-detection';

const metres = (a: GeoPosition, b: GeoPosition) => haversineKm(a, b) * 1000;

/**
 * The saved place a position falls inside. Some of the fix's uncertainty is forgiven at the edge;
 * when places overlap (a landmark inside a neighbourhood) the smallest, most specific one wins.
 */
export function matchSavedPlace(position: GeoPosition, accuracy: number): SavedPlace | null {
  const slack = Math.min(accuracy, 50);
  let best: SavedPlace | null = null;
  for (const place of SAVED_PLACES) {
    const centre = { lng: place.at[0], lat: place.at[1] };
    if (metres(position, centre) > place.radius + slack) continue;
    if (!best || place.radius < best.radius) best = place;
  }
  return best;
}

/** Label for a button that opens the detections dialog: visits waiting to confirm win over status. */
export function detectionLabel(t: Strings, status: DetectionStatus, pending: number): string {
  const b = t.detect.button;
  return pending ? b.pending(pending) : b[status];
}

/** Turns a stream of location fixes into stays worth asking about, at most once per place a day. */
export class StayDetector {
  private stay: {
    anchor: GeoPosition;
    place: SavedPlace | null;
    start: number;
    last: number;
    reported: boolean;
  } | null = null;
  private readonly asked: { place: SavedPlace | null; position: GeoPosition; day: string }[] = [];

  add(fix: Fix): Omit<Detection, 'id' | 'rejected'> | null {
    if (fix.accuracy > MAX_ACCURACY_M) return null;
    const place = matchSavedPlace(fix.position, fix.accuracy);
    const prev = this.stay;
    const continues =
      prev !== null &&
      fix.time - prev.last <= MAX_GAP_MS &&
      (place
        ? prev.place === place
        : prev.place === null && metres(prev.anchor, fix.position) <= STAY_RADIUS_M);

    const stay = continues
      ? { ...prev!, last: fix.time }
      : { anchor: fix.position, place, start: fix.time, last: fix.time, reported: false };
    this.stay = stay;
    if (stay.reported || stay.last - stay.start < DWELL_MS) return null;
    stay.reported = true;

    const day = new Date(stay.start).toDateString();
    const seen = this.asked.some(
      (a) =>
        a.day === day &&
        (stay.place
          ? a.place === stay.place
          : a.place === null && metres(a.position, stay.anchor) <= STAY_RADIUS_M),
    );
    if (seen) return null;
    this.asked.push({ place: stay.place, position: stay.anchor, day });

    return {
      start: new Date(stay.start),
      minutes: Math.round((stay.last - stay.start) / 60_000),
      position: stay.anchor,
      place: stay.place,
      city: nearestCity(stay.anchor),
    };
  }
}

/**
 * Watches the browser's location while the app is open and queues visits for the user to confirm.
 * Nothing is logged without a confirmation, and fixes never leave the device.
 */
@Injectable({ providedIn: 'root' })
export class LocationDetection {
  readonly status = signal<DetectionStatus>('off');
  readonly pending = signal<Detection[]>([]);
  readonly lastFix = signal<Fix | null>(null);

  private watchId: number | null = null;
  private detector = new StayDetector();
  private nextId = 1;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stopWatching());
    if (readPreference()) void this.resumeIfAllowed();
  }

  enable(): void {
    if (this.watchId !== null) return;
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      this.status.set('unavailable');
      return;
    }
    this.status.set('starting');
    writePreference(true);
    this.watchId = navigator.geolocation.watchPosition(
      (p) => this.onFix(p),
      (e) => this.onError(e),
      { enableHighAccuracy: true, maximumAge: 60_000 },
    );
  }

  disable(): void {
    this.stopWatching();
    writePreference(false);
    this.status.set('off');
  }

  /** Accepts a detection; `answer` names the place when the app couldn't. */
  confirm(id: number, answer?: { name: string; coverage: string }): void {
    void answer; // Logging the visit lands with persistence; for now it just leaves the queue.
    this.remove(id);
  }

  /** The matched place was wrong: keep the stay, but ask what it was instead. */
  reject(id: number): void {
    this.pending.update((list) =>
      list.map((d) => (d.id === id ? { ...d, place: null, rejected: true } : d)),
    );
  }

  dismiss(id: number): void {
    this.remove(id);
  }

  private remove(id: number): void {
    this.pending.update((list) => list.filter((d) => d.id !== id));
  }

  private onFix(p: GeolocationPosition): void {
    const fix: Fix = {
      position: { lat: p.coords.latitude, lng: p.coords.longitude },
      accuracy: p.coords.accuracy,
      time: p.timestamp,
    };
    this.status.set('on');
    this.lastFix.set(fix);
    const found = this.detector.add(fix);
    if (found)
      this.pending.update((list) => [...list, { ...found, id: this.nextId++, rejected: false }]);
  }

  private onError(error: GeolocationPositionError): void {
    // Timeouts and lost signal are transient; the watch keeps trying. A refusal is final.
    if (error.code !== error.PERMISSION_DENIED) return;
    this.stopWatching();
    writePreference(false);
    this.status.set('denied');
  }

  private stopWatching(): void {
    if (this.watchId !== null) navigator.geolocation.clearWatch(this.watchId);
    this.watchId = null;
  }

  /** Picks detection back up after a reload, but only if it won't trigger a permission prompt. */
  private async resumeIfAllowed(): Promise<void> {
    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      if (permission.state === 'granted') this.enable();
    } catch {
      // No Permissions API: wait for the user to turn it on again.
    }
  }
}

function readPreference(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'on';
  } catch {
    return false;
  }
}

function writePreference(on: boolean): void {
  try {
    if (on) localStorage.setItem(STORAGE_KEY, 'on');
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked: detection still works, it just won't resume after a reload.
  }
}
