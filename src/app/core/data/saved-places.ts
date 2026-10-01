/**
 * Curated places with a footprint, for matching a location fix to a place. A centre point plus a
 * radius covers both a single building and a sprawling site like Mitad del Mundo — the radius just
 * grows. Coordinates are approximate until a real places dataset replaces this seed.
 */
export interface SavedPlace {
  name: string;
  city: string;
  kind: 'Landmark' | 'Neighbourhood';
  /** [longitude, latitude] */
  at: [number, number];
  /** Metres from `at` that still count as being there. */
  radius: number;
}

export const SAVED_PLACES: SavedPlace[] = [
  {
    name: 'Basílica del Voto Nacional',
    city: 'Quito',
    kind: 'Landmark',
    at: [-78.5072, -0.2147],
    radius: 120,
  },
  { name: 'Plaza Grande', city: 'Quito', kind: 'Landmark', at: [-78.5125, -0.2201], radius: 100 },
  { name: 'Mercado Central', city: 'Quito', kind: 'Landmark', at: [-78.5068, -0.216], radius: 90 },
  { name: 'Museo del Agua', city: 'Quito', kind: 'Landmark', at: [-78.5166, -0.2262], radius: 80 },
  {
    name: 'Parque Metropolitano',
    city: 'Quito',
    kind: 'Landmark',
    at: [-78.472, -0.18],
    radius: 1200,
  },
  {
    name: 'Mitad del Mundo',
    city: 'Quito',
    kind: 'Landmark',
    at: [-78.4558, -0.0022],
    radius: 450,
  },
  { name: 'La Floresta', city: 'Quito', kind: 'Neighbourhood', at: [-78.487, -0.205], radius: 600 },
  { name: 'Itchimbía', city: 'Quito', kind: 'Neighbourhood', at: [-78.5, -0.219], radius: 400 },
  { name: 'La Tola', city: 'Quito', kind: 'Neighbourhood', at: [-78.5035, -0.2235], radius: 350 },
  { name: 'Torre de Belém', city: 'Lisbon', kind: 'Landmark', at: [-9.216, 38.6916], radius: 120 },
  {
    name: 'Mosteiro dos Jerónimos',
    city: 'Lisbon',
    kind: 'Landmark',
    at: [-9.2068, 38.6979],
    radius: 200,
  },
  { name: 'Alfama', city: 'Lisbon', kind: 'Neighbourhood', at: [-9.13, 38.7115], radius: 500 },
  { name: 'Wat Pho', city: 'Bangkok', kind: 'Landmark', at: [100.493, 13.7465], radius: 200 },
];
