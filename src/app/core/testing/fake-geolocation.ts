/** Test-only: a `navigator.geolocation` the test drives by hand. */
export class FakeGeolocation {
  private success: PositionCallback | null = null;
  private failure: PositionErrorCallback | null = null;
  watching = false;

  readonly api = {
    watchPosition: (success: PositionCallback, failure?: PositionErrorCallback | null) => {
      this.success = success;
      this.failure = failure ?? null;
      this.watching = true;
      return 1;
    },
    clearWatch: () => {
      this.watching = false;
    },
    getCurrentPosition: () => {},
  } as unknown as Geolocation;

  install(): void {
    Object.defineProperty(navigator, 'geolocation', { value: this.api, configurable: true });
  }

  /** Reports a fix at `lat, lng`, `minutes` after a fixed start time. */
  emit(lat: number, lng: number, minutes: number, accuracy = 20): void {
    this.success?.({
      coords: { latitude: lat, longitude: lng, accuracy } as GeolocationCoordinates,
      timestamp: new Date(2026, 8, 30, 10, 0).getTime() + minutes * 60_000,
    } as GeolocationPosition);
  }

  deny(): void {
    this.failure?.({ code: 1, PERMISSION_DENIED: 1 } as GeolocationPositionError);
  }
}
