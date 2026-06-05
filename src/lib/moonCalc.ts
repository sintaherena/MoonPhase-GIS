import SunCalc from 'suncalc3';
import type { GeoCoordinate, MoonDetailData, MoonPhaseName } from '@/types';

/**
 * Convert a 0-1 phase value to a MoonPhaseName identifier.
 * The phase value represents the moon cycle position where:
 * 0 = new moon, 0.25 = first quarter, 0.5 = full moon, 0.75 = last quarter
 */
export function getMoonPhaseName(phaseValue: number): MoonPhaseName {
  // Normalize to 0-1 range
  const p = ((phaseValue % 1) + 1) % 1;

  if (p < 0.0625) return 'new_moon';
  if (p < 0.1875) return 'waxing_crescent';
  if (p < 0.3125) return 'first_quarter';
  if (p < 0.4375) return 'waxing_gibbous';
  if (p < 0.5625) return 'full_moon';
  if (p < 0.6875) return 'waning_gibbous';
  if (p < 0.8125) return 'last_quarter';
  if (p < 0.9375) return 'waning_crescent';
  return 'new_moon';
}

/**
 * Get the Indonesian label for a moon phase name.
 */
export function getPhaseLabel(name: MoonPhaseName): string {
  const labels: Record<MoonPhaseName, string> = {
    new_moon: 'Bulan Baru',
    waxing_crescent: 'Sabit Muda',
    first_quarter: 'Kuartal Pertama',
    waxing_gibbous: 'Bulan Sabit Penuh',
    full_moon: 'Bulan Purnama',
    waning_gibbous: 'Bulan Sabit Penuh',
    last_quarter: 'Kuartal Terakhir',
    waning_crescent: 'Sabit Muda',
  };
  return labels[name];
}

/**
 * Calculate moon age in days from the last new moon.
 */
function getMoonAgeDays(date: Date): number {
  // Approximate synodic month = 29.53059 days
  const synodicMonth = 29.53059;
  // Reference new moon: January 6, 2000 18:14 UTC
  const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
  const daysSinceKnown = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  return ((daysSinceKnown % synodicMonth) + synodicMonth) % synodicMonth;
}

/**
 * Get comprehensive moon data for a given coordinate and date.
 */
export function getMoonData(
  coordinate: GeoCoordinate,
  date: Date
): MoonDetailData {
  const { lat, lng } = coordinate;

  // Get moon position (azimuth and altitude/elevation)
  const moonPosition = SunCalc.getMoonPosition(date, lat, lng);

  // Get moon illumination data
  const moonIllumination = SunCalc.getMoonIllumination(date);

  // Get moon times (rise, set, transit)
  const moonTimes = SunCalc.getMoonTimes(date, lat, lng);

  // Get phase name from the illumination phaseValue
  const phaseValue = moonIllumination.phaseValue;
  const phaseName = getMoonPhaseName(phaseValue);
  const phaseLabel = getPhaseLabel(phaseName);

  // Calculate age in days
  const ageDays = getMoonAgeDays(date);

  // Convert azimuth from radians to degrees
  const azimuthDegrees = moonPosition.azimuthDegrees;

  // Convert altitude from radians to degrees
  const elevationDegrees = moonPosition.altitudeDegrees;

  // Distance in km
  const distanceKm = moonPosition.distance;

  return {
    phase: phaseName,
    phaseLabel,
    illumination: moonIllumination.fraction,
    distance: distanceKm,
    azimuth: azimuthDegrees,
    elevation: elevationDegrees,
    moonrise: moonTimes.rise ?? null,
    moonset: moonTimes.set ?? null,
    ageDays,
    observedAt: date,
    coordinate,
  };
}
