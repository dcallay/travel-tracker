/** Another traveller on the system, with how many countries and cities they have logged. */
export interface Traveller {
  name: string;
  home: string;
  /** ISO 3166-1 alpha-2 code, lower case, e.g. `ec`. */
  nationality: string;
  countries: number;
  cities: number;
  /** Share of the world explored, as a percentage. */
  explored: number;
  /** Private travellers are ranked, but only their name and flag are shown. */
  isPrivate?: boolean;
  /** Most explored countries, best first; only on file for some travellers. */
  topCountries?: CountryExplored[];
}

export interface CountryExplored {
  /** ISO 3166-1 alpha-2 code, lower case. */
  code: string;
  /** Share of the country explored, as a percentage. */
  explored: number;
}

/** Seed data for the other travellers on the leaderboard. */
export const TRAVELLERS: Traveller[] = [
  {
    name: 'Ingrid Solberg', home: 'Oslo', nationality: 'no', countries: 47, cities: 112, explored: 14.6,
    topCountries: [{ code: 'no', explored: 58.2 }, { code: 'se', explored: 41.7 }, { code: 'dk', explored: 36.5 }, { code: 'is', explored: 29.8 }, { code: 'de', explored: 22.4 }],
  },
  {
    name: 'Tomás Okafor', home: 'Lagos', nationality: 'ng', countries: 41, cities: 96, explored: 11.9,
    topCountries: [{ code: 'ng', explored: 52.6 }, { code: 'gh', explored: 38.1 }, { code: 'gb', explored: 27.3 }, { code: 'za', explored: 21.9 }, { code: 'ke', explored: 18.4 }],
  },
  {
    name: 'Mei Tanaka', home: 'Osaka', nationality: 'jp', countries: 38, cities: 88, explored: 13.2,
    topCountries: [{ code: 'jp', explored: 61.3 }, { code: 'kr', explored: 44.0 }, { code: 'tw', explored: 35.2 }, { code: 'th', explored: 28.7 }, { code: 'vn', explored: 24.5 }],
  },
  {
    name: 'Rafael Duarte', home: 'São Paulo', nationality: 'br', countries: 34, cities: 71, explored: 9.7,
    topCountries: [{ code: 'br', explored: 47.9 }, { code: 'ar', explored: 33.4 }, { code: 'cl', explored: 26.1 }, { code: 'pt', explored: 24.8 }, { code: 'uy', explored: 19.6 }],
  },
  {
    name: 'Chloé Martin', home: 'Lyon', nationality: 'fr', countries: 31, cities: 64, explored: 10.4,
    topCountries: [{ code: 'fr', explored: 55.1 }, { code: 'it', explored: 34.7 }, { code: 'es', explored: 31.2 }, { code: 'ma', explored: 22.3 }, { code: 'be', explored: 20.9 }],
  },
  { name: 'Arjun Mehta', home: 'Pune', nationality: 'in', countries: 29, cities: 58, explored: 8.1, isPrivate: true },
  {
    name: 'Hannah Weiss', home: 'Berlin', nationality: 'de', countries: 27, cities: 61, explored: 8.9,
    topCountries: [{ code: 'de', explored: 49.3 }, { code: 'at', explored: 35.6 }, { code: 'ch', explored: 28.4 }, { code: 'nl', explored: 22.1 }, { code: 'cz', explored: 19.7 }],
  },
  {
    name: 'Lucas Ferreira', home: 'Porto', nationality: 'pt', countries: 27, cities: 54, explored: 7.6,
    topCountries: [{ code: 'pt', explored: 51.8 }, { code: 'es', explored: 29.4 }, { code: 'br', explored: 21.6 }, { code: 'fr', explored: 17.2 }, { code: 'ma', explored: 14.9 }],
  },
  {
    name: 'Amara Nwosu', home: 'Accra', nationality: 'gh', countries: 24, cities: 49, explored: 6.8,
    topCountries: [{ code: 'gh', explored: 44.7 }, { code: 'ng', explored: 26.3 }, { code: 'ci', explored: 19.8 }, { code: 'gb', explored: 16.4 }, { code: 'sn', explored: 13.1 }],
  },
  {
    name: 'Diego Salazar', home: 'Quito', nationality: 'ec', countries: 22, cities: 45, explored: 7.2,
    topCountries: [{ code: 'ec', explored: 46.2 }, { code: 'pe', explored: 30.5 }, { code: 'co', explored: 24.9 }, { code: 'bo', explored: 17.3 }, { code: 'cl', explored: 12.8 }],
  },
  { name: 'Sofia Rossi', home: 'Turin', nationality: 'it', countries: 20, cities: 40, explored: 5.9 },
  { name: 'Noah Becker', home: 'Zurich', nationality: 'ch', countries: 18, cities: 37, explored: 5.1 },
  { name: 'Yuki Mori', home: 'Sapporo', nationality: 'jp', countries: 16, cities: 30, explored: 4.6 },
  { name: 'Elena Popescu', home: 'Bucharest', nationality: 'ro', countries: 14, cities: 27, explored: 3.5 },
  { name: 'Omar Haddad', home: 'Amman', nationality: 'jo', countries: 13, cities: 19, explored: 3.1 },
  { name: 'Grace Kim', home: 'Seoul', nationality: 'kr', countries: 12, cities: 25, explored: 4.2 },
  { name: 'Mateo García', home: 'Valencia', nationality: 'es', countries: 11, cities: 20, explored: 3.3 },
  { name: 'Priya Nair', home: 'Kochi', nationality: 'in', countries: 10, cities: 18, explored: 2.7 },
  { name: "Liam O'Connor", home: 'Cork', nationality: 'ie', countries: 9, cities: 16, explored: 2.4 },
  { name: 'Zanele Dube', home: 'Durban', nationality: 'za', countries: 8, cities: 14, explored: 2.1 },
  { name: 'Felix Wagner', home: 'Graz', nationality: 'at', countries: 7, cities: 15, explored: 2.3 },
  { name: 'Ana Lima', home: 'Recife', nationality: 'br', countries: 6, cities: 11, explored: 1.6 },
  { name: 'Kenji Sato', home: 'Fukuoka', nationality: 'jp', countries: 5, cities: 9, explored: 1.4 },
  { name: 'Isabel Cruz', home: 'Cebu', nationality: 'ph', countries: 4, cities: 8, explored: 1.1 },
  { name: 'Jonas Berg', home: 'Malmö', nationality: 'se', countries: 3, cities: 6, explored: 0.8 },
  { name: 'Laila Rahimi', home: 'Herat', nationality: 'af', countries: 3, cities: 4, explored: 0.6, isPrivate: true },
  { name: 'Marco Bianchi', home: 'Bologna', nationality: 'it', countries: 2, cities: 3, explored: 0.5 },
  { name: 'Nora Lindqvist', home: 'Umeå', nationality: 'se', countries: 1, cities: 2, explored: 0.3 },
  { name: 'Sam Taylor', home: 'Leeds', nationality: 'gb', countries: 1, cities: 1, explored: 0.1 },
];
