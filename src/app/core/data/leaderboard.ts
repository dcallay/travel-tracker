import { Traveller } from './traveller-data';

export interface RankedTraveller extends Traveller {
  /** 1-based; travellers with the same countries and cities share a rank. */
  rank: number;
  isYou: boolean;
}

export interface Leaderboard {
  top: RankedTraveller[];
  you: RankedTraveller;
  /** Everyone ranked, you included. */
  total: number;
  /** Whether your row is already among `top`. */
  youInTop: boolean;
  /** Share of the other travellers ranked below you, 0–100. */
  aheadOfPct: number;
}

/** More countries first, then more cities. */
function compare(a: Traveller, b: Traveller): number {
  return b.countries - a.countries || b.cities - a.cities;
}

/** Ranks you among the other travellers and keeps the first `size` rows. */
export function rankTravellers(others: Traveller[], you: Traveller, size = 10): Leaderboard {
  const everyone = [{ ...you, isYou: true }, ...others.map((o) => ({ ...o, isYou: false }))];
  // Stable sort keeps you ahead of anyone you tie with.
  const sorted = everyone.sort(compare);
  const ranked: RankedTraveller[] = [];
  sorted.forEach((t, i) => {
    const prev = ranked[i - 1];
    const rank = prev && compare(prev, t) === 0 ? prev.rank : i + 1;
    ranked.push({ ...t, rank });
  });
  const top = ranked.slice(0, size);
  const youRow = ranked.find((t) => t.isYou)!;
  const behind = others.filter((o) => compare(you, o) < 0).length;
  return {
    top,
    you: youRow,
    total: ranked.length,
    youInTop: top.includes(youRow),
    aheadOfPct: others.length ? Math.round((behind / others.length) * 100) : 0,
  };
}
