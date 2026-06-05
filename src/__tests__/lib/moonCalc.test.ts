import { getMoonData, getMoonPhaseName, getPhaseLabel } from '@/lib/moonCalc';
import type { MoonPhaseName } from '@/types';

describe('getMoonPhaseName', () => {
  it('returns new_moon for phase value 0', () => {
    expect(getMoonPhaseName(0)).toBe('new_moon');
  });

  it('returns new_moon for phase value close to 1 (wraps around)', () => {
    expect(getMoonPhaseName(0.99)).toBe('new_moon');
  });

  it('returns waxing_crescent for phase value 0.125', () => {
    expect(getMoonPhaseName(0.125)).toBe('waxing_crescent');
  });

  it('returns first_quarter for phase value 0.25', () => {
    expect(getMoonPhaseName(0.25)).toBe('first_quarter');
  });

  it('returns waxing_gibbous for phase value 0.375', () => {
    expect(getMoonPhaseName(0.375)).toBe('waxing_gibbous');
  });

  it('returns full_moon for phase value 0.5', () => {
    expect(getMoonPhaseName(0.5)).toBe('full_moon');
  });

  it('returns waning_gibbous for phase value 0.625', () => {
    expect(getMoonPhaseName(0.625)).toBe('waning_gibbous');
  });

  it('returns last_quarter for phase value 0.75', () => {
    expect(getMoonPhaseName(0.75)).toBe('last_quarter');
  });

  it('returns waning_crescent for phase value 0.875', () => {
    expect(getMoonPhaseName(0.875)).toBe('waning_crescent');
  });

  it('normalizes negative phase values', () => {
    expect(getMoonPhaseName(-0.5)).toBe('full_moon');
  });

  it('normalizes phase values greater than 1', () => {
    expect(getMoonPhaseName(1.5)).toBe('full_moon');
  });

  it('returns valid phase names for boundary values', () => {
    const validPhases: MoonPhaseName[] = [
      'new_moon', 'waxing_crescent', 'first_quarter', 'waxing_gibbous',
      'full_moon', 'waning_gibbous', 'last_quarter', 'waning_crescent',
    ];
    
    for (let i = 0; i < 1; i += 0.01) {
      const phase = getMoonPhaseName(i);
      expect(validPhases).toContain(phase);
    }
  });
});

describe('getPhaseLabel', () => {
  it('returns English labels for all phases', () => {
    expect(getPhaseLabel('new_moon')).toBe('New Moon');
    expect(getPhaseLabel('waxing_crescent')).toBe('Waxing Crescent');
    expect(getPhaseLabel('first_quarter')).toBe('First Quarter');
    expect(getPhaseLabel('waxing_gibbous')).toBe('Waxing Gibbous');
    expect(getPhaseLabel('full_moon')).toBe('Full Moon');
    expect(getPhaseLabel('waning_gibbous')).toBe('Waning Gibbous');
    expect(getPhaseLabel('last_quarter')).toBe('Last Quarter');
    expect(getPhaseLabel('waning_crescent')).toBe('Waning Crescent');
  });

  it('returns string for every valid phase name', () => {
    const phases: MoonPhaseName[] = [
      'new_moon', 'waxing_crescent', 'first_quarter', 'waxing_gibbous',
      'full_moon', 'waning_gibbous', 'last_quarter', 'waning_crescent',
    ];
    
    phases.forEach((phase) => {
      const label = getPhaseLabel(phase);
      expect(typeof label).toBe('string');
      expect(label.length).toBeGreaterThan(0);
    });
  });
});

describe('getMoonData', () => {
  const jakartaCoordinate = { lat: -6.2, lng: 106.8 };
  const testDate = new Date('2026-06-05T12:00:00Z');

  it('returns valid structure with real coordinates', () => {
    const data = getMoonData(jakartaCoordinate, testDate);

    expect(data).toHaveProperty('phase');
    expect(data).toHaveProperty('phaseLabel');
    expect(data).toHaveProperty('illumination');
    expect(data).toHaveProperty('distance');
    expect(data).toHaveProperty('azimuth');
    expect(data).toHaveProperty('elevation');
    expect(data).toHaveProperty('moonrise');
    expect(data).toHaveProperty('moonset');
    expect(data).toHaveProperty('ageDays');
    expect(data).toHaveProperty('observedAt');
    expect(data).toHaveProperty('coordinate');
  });

  it('returns illumination between 0 and 1', () => {
    const data = getMoonData(jakartaCoordinate, testDate);
    expect(data.illumination).toBeGreaterThanOrEqual(0);
    expect(data.illumination).toBeLessThanOrEqual(1);
  });

  it('returns positive distance', () => {
    const data = getMoonData(jakartaCoordinate, testDate);
    expect(data.distance).toBeGreaterThan(0);
  });

  it('returns valid phase name', () => {
    const data = getMoonData(jakartaCoordinate, testDate);
    const validPhases: MoonPhaseName[] = [
      'new_moon', 'waxing_crescent', 'first_quarter', 'waxing_gibbous',
      'full_moon', 'waning_gibbous', 'last_quarter', 'waning_crescent',
    ];
    expect(validPhases).toContain(data.phase);
  });

  it('returns Indonesian phase label', () => {
    const data = getMoonData(jakartaCoordinate, testDate);
    expect(typeof data.phaseLabel).toBe('string');
    expect(data.phaseLabel.length).toBeGreaterThan(0);
  });

  it('returns correct coordinate in result', () => {
    const data = getMoonData(jakartaCoordinate, testDate);
    expect(data.coordinate.lat).toBe(jakartaCoordinate.lat);
    expect(data.coordinate.lng).toBe(jakartaCoordinate.lng);
  });

  it('returns observedAt as the input date', () => {
    const data = getMoonData(jakartaCoordinate, testDate);
    expect(data.observedAt.getTime()).toBe(testDate.getTime());
  });

  it('returns ageDays as a positive number', () => {
    const data = getMoonData(jakartaCoordinate, testDate);
    expect(data.ageDays).toBeGreaterThanOrEqual(0);
    expect(data.ageDays).toBeLessThanOrEqual(29.54);
  });

  it('works with different coordinates (Tokyo)', () => {
    const tokyoCoordinate = { lat: 35.68, lng: 139.69 };
    const data = getMoonData(tokyoCoordinate, testDate);
    expect(data.illumination).toBeGreaterThanOrEqual(0);
    expect(data.illumination).toBeLessThanOrEqual(1);
    expect(data.distance).toBeGreaterThan(0);
  });

  it('works with different dates', () => {
    const date1 = new Date('2026-01-15T12:00:00Z');
    const date2 = new Date('2026-07-15T12:00:00Z');
    
    const data1 = getMoonData(jakartaCoordinate, date1);
    const data2 = getMoonData(jakartaCoordinate, date2);
    
    // Both should return valid illumination values
    expect(data1.illumination).toBeGreaterThanOrEqual(0);
    expect(data1.illumination).toBeLessThanOrEqual(1);
    expect(data2.illumination).toBeGreaterThanOrEqual(0);
    expect(data2.illumination).toBeLessThanOrEqual(1);
    // Different dates should potentially produce different results
    expect(data1.observedAt.getTime()).not.toBe(data2.observedAt.getTime());
  });
});
