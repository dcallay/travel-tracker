import { CITY_GEO, TRAVEL_TREE } from './data/travel-data';

export interface GeoPosition {
  lat: number;
  lng: number;
}

export interface NearbyCity {
  city: string;
  country: string;
  km: number;
}

/** Photos further than this from every city on file aren't matched to one. */
export const MAX_CITY_KM = 50;

/** The closest city on file to a position, if one lies within {@link MAX_CITY_KM}. */
export function nearestCity(position: GeoPosition): NearbyCity | null {
  let best: NearbyCity | null = null;
  for (const continent of TRAVEL_TREE) {
    for (const country of continent.countries) {
      for (const city of country.cities) {
        const geo = CITY_GEO[city.name];
        if (!geo) continue;
        const km = haversineKm(position, { lng: geo[0], lat: geo[1] });
        if (!best || km < best.km) best = { city: city.name, country: country.name, km };
      }
    }
  }
  return best && best.km <= MAX_CITY_KM ? best : null;
}

export function haversineKm(a: GeoPosition, b: GeoPosition): number {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}
