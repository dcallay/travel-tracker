import { TRAVEL_TREE } from '../../../core/data/travel-data';
import { EN } from '../../../core/i18n/en';
import { ES } from '../../../core/i18n/es';
import { buildCityView } from './city-view';

describe('buildCityView', () => {
  const quito = [0, 0, 0];
  const cuenca = [0, 0, 1];

  it('names the city with its country, continent and problem-report label', () => {
    const view = buildCityView(TRAVEL_TREE, quito, EN);
    expect(view.name).toBe('Quito');
    expect(view.kicker).toBe('Ecuador · South America');
    expect(view.placeLabel).toBe('Ecuador · Quito');
    expect(view.flag).toContain('/ec.png');
  });

  it('scores a city as weighted places checked off over weighted places on file', () => {
    // Quito: 13 neighbourhoods + 9 landmarks×2 = 31 of 18 + 14×2 = 46
    const view = buildCityView(TRAVEL_TREE, quito, EN);
    expect(view.formula).toBe(
      '31 of 46 weighted places. 13 neighbourhoods at weight 1, 9 landmarks at weight 2.',
    );
    expect(view.pct).toBe('67.4%');
    expect(view.nRatio).toBe('13 / 18');
    expect(view.lRatio).toBe('9 / 14');
    expect(view.openCount).toBe('5 neighbourhoods · 5 landmarks');
  });

  it('lists itemised open places and discoveries when the city has them', () => {
    const view = buildCityView(TRAVEL_TREE, quito, EN);
    expect(view.discCount).toBe('7');
    expect(view.openList).toHaveLength(6);
    expect(view.openList[0]).toEqual({ name: 'Mercado Central', kind: 'Landmark' });
  });

  it('explains when open places have not been itemised, and when nothing is logged', () => {
    const view = buildCityView(TRAVEL_TREE, cuenca, EN);
    expect(view.openList).toEqual([
      { name: '5 neighbourhoods and 5 landmarks not itemised yet', kind: 'Seed data' },
    ]);
    const guayaquil = buildCityView(TRAVEL_TREE, [0, 0, 2], EN);
    expect(guayaquil.discList).toEqual(['Nothing logged here yet']);
  });

  it('renders its text in the chosen language, including open place kinds', () => {
    const view = buildCityView(TRAVEL_TREE, quito, ES);
    expect(view.formula).toBe(
      '31 de 46 lugares ponderados. 13 barrios con peso 1, 9 monumentos con peso 2.',
    );
    expect(view.openList[0]).toEqual({ name: 'Mercado Central', kind: 'Monumento' });
    expect(buildCityView(TRAVEL_TREE, cuenca, ES).openList[0].kind).toBe('Datos iniciales');
  });
});
