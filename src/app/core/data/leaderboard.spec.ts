import { rankTravellers } from './leaderboard';
import { Traveller } from './traveller-data';

const t = (name: string, countries: number, cities: number): Traveller => ({
  name,
  home: 'Testville',
  nationality: 'ec',
  countries,
  cities,
  explored: 0,
});

describe('rankTravellers', () => {
  const others = [t('A', 10, 20), t('B', 8, 30), t('C', 8, 12), t('D', 3, 5), t('E', 1, 1)];

  it('ranks by countries, then cities', () => {
    const board = rankTravellers(others, t('You', 0, 0), 5);
    expect(board.top.map((r) => r.name)).toEqual(['A', 'B', 'C', 'D', 'E']);
    expect(board.top.map((r) => r.rank)).toEqual([1, 2, 3, 4, 5]);
  });

  it('keeps you in the top rows when you place there', () => {
    const board = rankTravellers(others, t('You', 8, 20), 3);
    expect(board.top.map((r) => r.name)).toEqual(['A', 'B', 'You']);
    expect(board.youInTop).toBe(true);
    expect(board.you.rank).toBe(3);
    expect(board.total).toBe(6);
    expect(board.aheadOfPct).toBe(60);
  });

  it('reports your rank when you fall outside the top rows', () => {
    const board = rankTravellers(others, t('You', 2, 9), 3);
    expect(board.top).toHaveLength(3);
    expect(board.youInTop).toBe(false);
    expect(board.you.rank).toBe(5);
    expect(board.aheadOfPct).toBe(20);
  });

  it('gives tied travellers the same rank, listing you first', () => {
    const board = rankTravellers(others, t('You', 8, 12), 6);
    expect(board.top.slice(2, 4).map((r) => [r.name, r.rank])).toEqual([
      ['You', 3],
      ['C', 3],
    ]);
    expect(board.top[4].rank).toBe(5);
    expect(board.aheadOfPct).toBe(40);
  });
});
