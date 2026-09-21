import { barWidth, fmtPct } from './data/travel-calc';

/** A place as shown in a list: name, a sub-line, its coverage and where clicking it leads. */
export interface Row {
  name: string;
  meta: string;
  pct: string;
  bar: string;
  barColor: string;
  fg: string;
  path: number[] | null;
}

export function toRow(name: string, meta: string, p: number, next: number[] | null): Row {
  return {
    name,
    meta,
    pct: fmtPct(p),
    bar: barWidth(p),
    barColor: p === 0 ? 'var(--color-neutral-400)' : 'var(--color-accent)',
    fg: p === 0 ? 'var(--color-neutral-600)' : 'var(--color-text)',
    path: next,
  };
}
