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
