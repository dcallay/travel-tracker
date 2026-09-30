/** Month abbreviations as the seed data writes them. */
export const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** Parses a seed-data day such as `09 Feb 2026`; null if it is not in that form. */
export function parseSeedDate(value: string): Date | null {
  const match = /^(\d{1,2}) ([A-Z][a-z]{2}) (\d{4})$/.exec(value);
  const month = match ? MONTHS.indexOf(match[2]) : -1;
  if (!match || month < 0) return null;
  return new Date(Number(match[3]), month, Number(match[1]));
}

/** Re-formats a seed-data month (`Mar 2026`) for a locale; anything else passes through. */
export function localMonthYear(value: string, locale: string): string {
  const [mon, year] = value.split(' ');
  const month = MONTHS.indexOf(mon);
  if (month < 0 || !/^\d{4}$/.test(year ?? '')) return value;
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(
    new Date(Number(year), month, 1),
  );
}

/** `14 Mar 2026`, built by hand so every browser gives the same English. */
export function englishDate(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}
