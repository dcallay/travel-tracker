import { parseSeedDate } from './dates';

describe('parseSeedDate', () => {
  it('reads a seed-data day', () => {
    expect(parseSeedDate('09 Feb 2026')).toEqual(new Date(2026, 1, 9));
    expect(parseSeedDate('14 Sep 2026')).toEqual(new Date(2026, 8, 14));
  });

  it('rejects anything else', () => {
    expect(parseSeedDate('Feb 2026')).toBeNull();
    expect(parseSeedDate('09 Foo 2026')).toBeNull();
    expect(parseSeedDate('')).toBeNull();
  });
});
