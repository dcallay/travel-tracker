import { toSlug } from './slug';

describe('toSlug', () => {
  it.each([
    ['Quito', 'quito'],
    ['South America', 'south-america'],
    ['Baños', 'banos'],
    ['Hội An', 'hoi-an'],
    ['Medellín', 'medellin'],
    ['United States', 'united-states'],
  ])('%s → %s', (name, slug) => {
    expect(toSlug(name)).toBe(slug);
  });
});
