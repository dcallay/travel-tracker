import { TestBed } from '@angular/core/testing';

import { EN } from './i18n/en';
import { ES } from './i18n/es';
import {
  DWELL_MS,
  LocationDetection,
  StayDetector,
  detectionLabel,
  matchSavedPlace,
} from './location-detection';
import { FakeGeolocation } from './testing/fake-geolocation';

const BASILICA = { lat: -0.2147, lng: -78.5072 };
const LA_FLORESTA = { lat: -0.205, lng: -78.487 };
/** Inside Quito but outside every saved place. */
const QUITO_UNKNOWN = { lat: -0.17, lng: -78.49 };
const T0 = new Date(2026, 8, 30, 10, 0).getTime();
const at = (minutes: number) => T0 + minutes * 60_000;

describe('matchSavedPlace', () => {
  it('matches a position inside a saved place', () => {
    expect(matchSavedPlace(BASILICA, 10)?.name).toBe('Basílica del Voto Nacional');
  });

  it('returns null away from every saved place', () => {
    expect(matchSavedPlace(QUITO_UNKNOWN, 10)).toBeNull();
  });

  it('prefers the smaller, more specific place where two overlap', () => {
    // Between Itchimbía (400 m) and La Tola (350 m), inside both.
    expect(matchSavedPlace({ lat: -0.22125, lng: -78.50175 }, 10)?.name).toBe('La Tola');
  });

  it('forgives some of the fix uncertainty at the edge, but not all of it', () => {
    // ~140 m from the Basílica's centre, just past its 120 m radius.
    const edge = { lat: -0.2147, lng: -78.50846 };
    expect(matchSavedPlace(edge, 30)?.name).toBe('Basílica del Voto Nacional');
    expect(matchSavedPlace(edge, 5)).toBeNull();
  });
});

describe('detectionLabel', () => {
  it('names the status when nothing is waiting', () => {
    expect(detectionLabel(EN, 'off', 0)).toBe('Turn on detection');
    expect(detectionLabel(EN, 'starting', 0)).toBe('Starting detection…');
    expect(detectionLabel(EN, 'on', 0)).toBe('Detection on');
    expect(detectionLabel(EN, 'denied', 0)).toBe('Detection blocked');
    expect(detectionLabel(EN, 'unavailable', 0)).toBe('Detection unavailable');
  });

  it('counts visits waiting to be confirmed ahead of the status', () => {
    expect(detectionLabel(EN, 'on', 1)).toBe('Confirm 1 detection');
    expect(detectionLabel(EN, 'off', 3)).toBe('Confirm 3 detections');
  });

  it('follows the chosen language', () => {
    expect(detectionLabel(ES, 'off', 0)).toBe('Activar detección');
    expect(detectionLabel(ES, 'on', 2)).toBe('Confirmar 2 detecciones');
  });
});

describe('StayDetector', () => {
  let detector: StayDetector;
  beforeEach(() => (detector = new StayDetector()));

  const stay = (pos: { lat: number; lng: number }, from: number, to: number, step = 1) => {
    const found = [];
    for (let m = from; m <= to; m += step) {
      const d = detector.add({ position: pos, accuracy: 20, time: at(m) });
      if (d) found.push(d);
    }
    return found;
  };

  it('reports a saved place once you have stayed long enough', () => {
    expect(stay(BASILICA, 0, DWELL_MS / 60_000 - 1)).toHaveLength(0);
    const [found] = stay(BASILICA, DWELL_MS / 60_000, 20);
    expect(found.place?.name).toBe('Basílica del Voto Nacional');
    expect(found.city?.city).toBe('Quito');
    expect(found.minutes).toBe(5);
  });

  it('ignores passing by', () => {
    expect(stay(BASILICA, 0, 2)).toHaveLength(0);
    expect(stay(LA_FLORESTA, 3, 4)).toHaveLength(0);
  });

  it('ignores fixes too vague to place you', () => {
    for (let m = 0; m <= 10; m++) {
      expect(detector.add({ position: BASILICA, accuracy: 500, time: at(m) })).toBeNull();
    }
  });

  it('reports a stay somewhere unknown with no place, to ask about', () => {
    const [found] = stay(QUITO_UNKNOWN, 0, 6);
    expect(found.place).toBeNull();
    expect(found.city?.city).toBe('Quito');
  });

  it('asks about a place only once a day, even after leaving and coming back', () => {
    expect(stay(BASILICA, 0, 6)).toHaveLength(1);
    expect(stay(QUITO_UNKNOWN, 10, 16)).toHaveLength(1);
    expect(stay(BASILICA, 20, 30)).toHaveLength(0);
  });

  it('starts a new stay after a long gap between fixes', () => {
    expect(stay(QUITO_UNKNOWN, 0, 3)).toHaveLength(0);
    expect(stay(QUITO_UNKNOWN, 40, 43)).toHaveLength(0);
  });
});

describe('LocationDetection', () => {
  let geo: FakeGeolocation;
  let detection: LocationDetection;

  beforeEach(() => {
    localStorage.clear();
    geo = new FakeGeolocation();
    geo.install();
    detection = TestBed.inject(LocationDetection);
  });

  it('is off until turned on, then queues detections from location fixes', () => {
    expect(detection.status()).toBe('off');
    detection.enable();
    expect(detection.status()).toBe('starting');
    for (let m = 0; m <= 5; m++) geo.emit(BASILICA.lat, BASILICA.lng, m);
    expect(detection.status()).toBe('on');
    expect(detection.pending().map((d) => d.place?.name)).toEqual(['Basílica del Voto Nacional']);
  });

  it('turns a rejected match into a question, and clears detections once answered', () => {
    detection.enable();
    for (let m = 0; m <= 5; m++) geo.emit(BASILICA.lat, BASILICA.lng, m);
    const [d] = detection.pending();
    detection.reject(d.id);
    expect(detection.pending()[0]).toMatchObject({ place: null, rejected: true });
    detection.confirm(d.id, { name: 'Café', coverage: 'discovery' });
    expect(detection.pending()).toEqual([]);
  });

  it('stops watching and reports a refused permission', () => {
    detection.enable();
    geo.deny();
    expect(detection.status()).toBe('denied');
    expect(geo.watching).toBe(false);
  });

  it('stops watching when turned off', () => {
    detection.enable();
    detection.disable();
    expect(detection.status()).toBe('off');
    expect(geo.watching).toBe(false);
  });
});
