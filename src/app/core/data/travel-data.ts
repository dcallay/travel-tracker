export interface OpenPlace {
  name: string;
  kind: string;
}

export interface CityData {
  name: string;
  /** Neighbourhoods visited / total known (weight 1 each) */
  nv: number;
  nt: number;
  /** Landmarks visited / total known (weight 2 each) */
  lv: number;
  lt: number;
  /** Month/year of the most recent visit, or null if never visited */
  last: string | null;
  /** Personal discoveries — off the curated list, raise the Local Knowledge Score */
  disc: string[];
  /** Curated places still open, itemised for the city detail view */
  open: OpenPlace[];
}

export interface CountryData {
  name: string;
  /** Weight of curated places on file outside the seeded cities */
  rest: number;
  cities: CityData[];
}

export interface ContinentData {
  name: string;
  countries: CountryData[];
}

function city(
  name: string,
  nv: number,
  nt: number,
  lv: number,
  lt: number,
  last: string | null,
  disc: string[] = [],
  open: OpenPlace[] = [],
): CityData {
  return { name, nv, nt, lv, lt, last, disc, open };
}

export const TRAVEL_TREE: ContinentData[] = [
  {
    name: 'South America',
    countries: [
      {
        name: 'Ecuador',
        rest: 210,
        cities: [
          city('Quito', 13, 18, 9, 14, 'Mar 2026',
            ['Café Galletti, La Floresta', 'Hierba Buena bakery', 'Mirador de Guápulo steps', 'Bandido Brewing', 'La Ronda after 9pm', 'Cumandá riverside', 'Rincón de Cantuña'],
            [{ name: 'Mercado Central', kind: 'Landmark' }, { name: 'Parque Metropolitano', kind: 'Landmark' }, { name: 'Itchimbía', kind: 'Neighbourhood' }, { name: 'La Tola', kind: 'Neighbourhood' }, { name: 'Museo del Agua', kind: 'Landmark' }, { name: 'Chilibulo', kind: 'Neighbourhood' }]),
          city('Cuenca', 4, 9, 2, 7, 'Mar 2026', ['Tienda de sombreros, calle Larga', 'Mercado 10 de Agosto']),
          city('Guayaquil', 2, 11, 1, 8, 'Feb 2025'),
          city('Baños', 0, 4, 0, 5, null),
        ],
      },
      {
        name: 'Peru',
        rest: 240,
        cities: [
          city('Lima', 5, 16, 3, 12, 'Aug 2025', ['Cevichería in Surquillo']),
          city('Cusco', 3, 8, 4, 10, 'Aug 2025', ['Panadería on Tandapata', 'Mirador San Blas', 'Hostal courtyard, Choquechaka']),
          city('Arequipa', 0, 7, 0, 6, null),
        ],
      },
      {
        name: 'Colombia',
        rest: 250,
        cities: [
          city('Bogotá', 4, 14, 2, 11, 'Nov 2024'),
          city('Medellín', 3, 10, 1, 8, 'Nov 2024', ['Café in Laureles']),
        ],
      },
      { name: 'Chile', rest: 210, cities: [city('Santiago', 2, 13, 1, 10, 'Jan 2024')] },
      { name: 'Argentina', rest: 260, cities: [city('Buenos Aires', 0, 15, 0, 13, null)] },
    ],
  },
  {
    name: 'Europe',
    countries: [
      {
        name: 'Portugal',
        rest: 150,
        cities: [
          city('Lisbon', 9, 15, 6, 13, 'Jun 2026',
            ['Tasca in Campo de Ourique', 'Mercearia do Bairro', 'Rooftop off Rua da Bica', 'Miradouro nobody uses', 'Bookshop on Rua Poço dos Negros'],
            [{ name: 'Mosteiro dos Jerónimos', kind: 'Landmark' }, { name: 'Marvila', kind: 'Neighbourhood' }, { name: 'Ajuda', kind: 'Neighbourhood' }, { name: 'Museu do Azulejo', kind: 'Landmark' }]),
          city('Porto', 3, 9, 2, 8, 'Jun 2026'),
        ],
      },
      {
        name: 'Spain',
        rest: 300,
        cities: [
          city('Barcelona', 6, 14, 4, 15, 'Sep 2025', ['Bodega in Poble-sec', 'Bunkers del Carmel at dawn']),
          city('Madrid', 2, 16, 2, 14, 'Sep 2025'),
        ],
      },
      { name: 'Netherlands', rest: 120, cities: [city('Amsterdam', 5, 12, 3, 11, 'Apr 2024', ['Brown café, Oud-West', 'Noord ferry loop'])] },
      { name: 'Italy', rest: 320, cities: [city('Rome', 3, 17, 3, 20, 'May 2023')] },
    ],
  },
  {
    name: 'Asia',
    countries: [
      {
        name: 'Thailand',
        rest: 180,
        cities: [
          city('Bangkok', 7, 16, 5, 14, 'Feb 2026',
            ['Noodle stall, Soi Rambuttri', 'Talad Noi walls', 'Bang Krachao loop', 'Wang Lang market'],
            [{ name: 'Wat Arun', kind: 'Landmark' }, { name: 'Thonburi', kind: 'Neighbourhood' }, { name: 'Jim Thompson House', kind: 'Landmark' }, { name: 'Khlong Toei', kind: 'Neighbourhood' }]),
          city('Chiang Mai', 3, 8, 2, 9, 'Feb 2026'),
        ],
      },
      {
        name: 'Vietnam',
        rest: 160,
        cities: [
          city('Hanoi', 3, 12, 2, 10, 'Feb 2026'),
          city('Hội An', 2, 4, 1, 6, 'Feb 2026', ['Bánh mì cart by the bridge']),
        ],
      },
      { name: 'Indonesia', rest: 400, cities: [city('Ubud', 2, 7, 1, 9, 'Mar 2023')] },
    ],
  },
  {
    name: 'North America',
    countries: [
      {
        name: 'Mexico',
        rest: 260,
        cities: [
          city('Mexico City', 6, 18, 4, 16, 'Oct 2025', ['Pulquería in Roma Sur', 'Tacos, Calle Zacatecas', 'Casa in San Rafael']),
          city('Oaxaca', 3, 7, 2, 8, 'Oct 2025'),
        ],
      },
      { name: 'United States', rest: 700, cities: [city('New York', 5, 20, 4, 22, 'Jul 2024')] },
      { name: 'Canada', rest: 300, cities: [city('Toronto', 0, 12, 0, 11, null)] },
    ],
  },
  {
    name: 'Africa',
    countries: [
      { name: 'Morocco', rest: 200, cities: [city('Marrakesh', 0, 9, 0, 12, null)] },
      { name: 'Kenya', rest: 180, cities: [city('Nairobi', 0, 8, 0, 9, null)] },
    ],
  },
  {
    name: 'Oceania',
    countries: [
      { name: 'Australia', rest: 260, cities: [city('Sydney', 0, 14, 0, 13, null)] },
      { name: 'New Zealand', rest: 140, cities: [city('Auckland', 0, 8, 0, 8, null)] },
    ],
  },
];

/** [longitude, latitude] for the cities on file, used to plot dots on the country map. */
export const CITY_GEO: Record<string, [number, number]> = {
  Quito: [-78.47, -0.18], Cuenca: [-79.0, -2.9], Guayaquil: [-79.9, -2.19], Baños: [-78.42, -1.4],
  Lima: [-77.04, -12.05], Cusco: [-71.97, -13.53], Arequipa: [-71.54, -16.41],
  Bogotá: [-74.07, 4.71], Medellín: [-75.56, 6.25], Santiago: [-70.65, -33.46], 'Buenos Aires': [-58.38, -34.6],
  Lisbon: [-9.14, 38.72], Porto: [-8.61, 41.15], Barcelona: [2.17, 41.39], Madrid: [-3.7, 40.42],
  Amsterdam: [4.9, 52.37], Rome: [12.5, 41.9], Bangkok: [100.5, 13.75], 'Chiang Mai': [98.98, 18.79],
  Hanoi: [105.83, 21.03], 'Hội An': [108.34, 15.88], Ubud: [115.26, -8.51],
  'Mexico City': [-99.13, 19.43], Oaxaca: [-96.72, 17.07], 'New York': [-74.01, 40.71], Toronto: [-79.38, 43.65],
  Marrakesh: [-7.98, 31.63], Nairobi: [36.82, -1.29], Sydney: [151.21, -33.87], Auckland: [174.76, -36.85],
};

const FLAG_CODES: Record<string, string> = {
  Ecuador: 'ec', Peru: 'pe', Colombia: 'co', Brazil: 'br', Chile: 'cl', Argentina: 'ar',
  Portugal: 'pt', Spain: 'es', France: 'fr', Germany: 'de', Netherlands: 'nl', Italy: 'it',
  Thailand: 'th', Vietnam: 'vn', Japan: 'jp', Indonesia: 'id', Mexico: 'mx',
  'United States': 'us', Canada: 'ca', Morocco: 'ma', Kenya: 'ke', Australia: 'au', 'New Zealand': 'nz',
};

export function flagImageUrl(countryName: string): string {
  const code = FLAG_CODES[countryName] ?? 'un';
  return `url(https://flagcdn.com/w160/${code}.png)`;
}

export interface TimelineEntry {
  date: string;
  place: string;
  detail: string;
  source: 'Geolocation' | 'Manual' | 'Photo';
  weight: string;
}

export const TIMELINE: TimelineEntry[] = [
  { date: '14 Sep 2026', place: 'Lisbon — Marvila', detail: 'Neighbourhood walked end to end', source: 'Geolocation', weight: '+1' },
  { date: '12 Sep 2026', place: 'Lisbon — Bookshop on Rua Poço dos Negros', detail: 'Personal discovery', source: 'Manual', weight: 'score +1' },
  { date: '28 Jun 2026', place: 'Lisbon — Torre de Belém', detail: 'Landmark', source: 'Photo', weight: '+2' },
  { date: '21 Mar 2026', place: 'Quito — Basílica del Voto Nacional', detail: 'Landmark', source: 'Photo', weight: '+2' },
  { date: '19 Mar 2026', place: 'Quito — Guápulo', detail: 'Neighbourhood', source: 'Geolocation', weight: '+1' },
  { date: '17 Mar 2026', place: 'Quito — Café Galletti', detail: 'Personal discovery', source: 'Manual', weight: 'score +1' },
  { date: '09 Feb 2026', place: 'Bangkok — Talad Noi', detail: 'Neighbourhood', source: 'Geolocation', weight: '+1' },
  { date: '07 Feb 2026', place: 'Bangkok — Wat Pho', detail: 'Landmark', source: 'Photo', weight: '+2' },
  { date: '02 Feb 2026', place: 'Hội An — Japanese Bridge', detail: 'Landmark', source: 'Manual', weight: '+2' },
];
