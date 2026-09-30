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
}

/** Your nationality, shown as a flag on your leaderboard row. */
export const YOUR_NATIONALITY = 'ec';

/** Seed data for the other travellers on the leaderboard. */
export const TRAVELLERS: Traveller[] = [
  { name: 'Ingrid Solberg', home: 'Oslo', nationality: 'no', countries: 47, cities: 112, explored: 14.6 },
  { name: 'Tomás Okafor', home: 'Lagos', nationality: 'ng', countries: 41, cities: 96, explored: 11.9 },
  { name: 'Mei Tanaka', home: 'Osaka', nationality: 'jp', countries: 38, cities: 88, explored: 13.2 },
  { name: 'Rafael Duarte', home: 'São Paulo', nationality: 'br', countries: 34, cities: 71, explored: 9.7 },
  { name: 'Chloé Martin', home: 'Lyon', nationality: 'fr', countries: 31, cities: 64, explored: 10.4 },
  { name: 'Arjun Mehta', home: 'Pune', nationality: 'in', countries: 29, cities: 58, explored: 8.1 },
  { name: 'Hannah Weiss', home: 'Berlin', nationality: 'de', countries: 27, cities: 61, explored: 8.9 },
  { name: 'Lucas Ferreira', home: 'Porto', nationality: 'pt', countries: 27, cities: 54, explored: 7.6 },
  { name: 'Amara Nwosu', home: 'Accra', nationality: 'gh', countries: 24, cities: 49, explored: 6.8 },
  { name: 'Diego Salazar', home: 'Quito', nationality: 'ec', countries: 22, cities: 45, explored: 7.2 },
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
  { name: 'Laila Rahimi', home: 'Herat', nationality: 'af', countries: 3, cities: 4, explored: 0.6 },
  { name: 'Marco Bianchi', home: 'Bologna', nationality: 'it', countries: 2, cities: 3, explored: 0.5 },
  { name: 'Nora Lindqvist', home: 'Umeå', nationality: 'se', countries: 1, cities: 2, explored: 0.3 },
  { name: 'Sam Taylor', home: 'Leeds', nationality: 'gb', countries: 1, cities: 1, explored: 0.1 },
];
