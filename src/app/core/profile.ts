import { Injectable, signal } from '@angular/core';

export interface ProfileData {
  /** Name shown to other travellers. */
  name: string;
  home: string;
  /** ISO 3166-1 alpha-2 code, lower case, e.g. `ec`. */
  nationality: string;
  /** Whether other travellers can see your public profile. */
  isPublic: boolean;
}

/** Nationalities offered in the account settings. */
export const NATIONALITIES = [
  'af', 'ar', 'at', 'au', 'be', 'bo', 'br', 'ca', 'ch', 'cl', 'cn', 'co', 'cr', 'cu', 'cz', 'de',
  'dk', 'do', 'ec', 'eg', 'es', 'fi', 'fr', 'gb', 'gh', 'gr', 'gt', 'hn', 'hu', 'id', 'ie', 'il',
  'in', 'it', 'jo', 'jp', 'ke', 'kr', 'ma', 'mx', 'ng', 'ni', 'nl', 'no', 'nz', 'pa', 'pe', 'ph',
  'pl', 'pt', 'py', 'ro', 'se', 'sv', 'th', 'tr', 'ua', 'us', 'uy', 've', 'vn', 'za',
];

/** The signed-in traveller's account settings. */
@Injectable({ providedIn: 'root' })
export class Profile {
  readonly data = signal<ProfileData>({
    name: 'David',
    home: 'Quito',
    nationality: 'ec',
    isPublic: true,
  });
}
