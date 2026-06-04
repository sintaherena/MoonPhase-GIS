'use client';

import { useMemo } from 'react';
import type { GeoCoordinate, MoonPhaseData, MoonPhaseName } from '@/types';

/**
 * Calculate moon phase based on date using simplified algorithm
 * Based on the synodic month (29.53059 days)
 */
function getMoonPhase(date: Date): { phase: MoonPhaseName; illumination: number; ageDays: number } {
  // Known new moon reference: January 6, 2000 18:14 UTC
  const knownNewMoon = new Date(2000, 0, 6, 18, 14, 0);
  const synodicMonth = 29.53059;

  const diffMs = date.getTime() - knownNewMoon.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const ageDays = ((diffDays % synodicMonth) + synodicMonth) % synodicMonth;

  // Calculate illumination (0-1)
  const illumination = (1 - Math.cos((2 * Math.PI * ageDays) / synodicMonth)) / 2;

  // Determine phase name based on age
  let phase: MoonPhaseName;
  const dayThreshold = synodicMonth / 8;

  if (ageDays < dayThreshold * 0.5) {
    phase = 'new_moon';
  } else if (ageDays < dayThreshold * 1.5) {
    phase = 'waxing_crescent';
  } else if (ageDays < dayThreshold * 2.5) {
    phase = 'first_quarter';
  } else if (ageDays < dayThreshold * 3.5) {
    phase = 'waxing_gibbous';
  } else if (ageDays < dayThreshold * 4.5) {
    phase = 'full_moon';
  } else if (ageDays < dayThreshold * 5.5) {
    phase = 'waning_gibbous';
  } else if (ageDays < dayThreshold * 6.5) {
    phase = 'last_quarter';
  } else if (ageDays < dayThreshold * 7.5) {
    phase = 'waning_crescent';
  } else {
    phase = 'new_moon';
  }

  return { phase, illumination, ageDays };
}

/**
 * Calculate approximate moon distance based on orbital mechanics
 * Returns distance in km (varies between ~356,500 and ~406,700 km)
 */
function getMoonDistance(date: Date): number {
  const knownPerigee = new Date(2024, 0, 13); // Approximate perigee
  const anomalisticMonth = 27.55455;
  const diffMs = date.getTime() - knownPerigee.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const cycle = ((diffDays % anomalisticMonth) + anomalisticMonth) % anomalisticMonth;

  // Simple sinusoidal approximation
  const minDistance = 356500;
  const maxDistance = 406700;
  const midDistance = (minDistance + maxDistance) / 2;
  const amplitude = (maxDistance - minDistance) / 2;

  return Math.round(midDistance - amplitude * Math.cos((2 * Math.PI * cycle) / anomalisticMonth));
}

interface UseMoonDataOptions {
  coordinate: GeoCoordinate | null;
  date?: Date;
}

export function useMoonData({ coordinate, date }: UseMoonDataOptions) {
  const moonData = useMemo<MoonPhaseData | null>(() => {
    if (!coordinate) return null;

    const targetDate = date ?? new Date();
    const { phase, illumination, ageDays } = getMoonPhase(targetDate);
    const distance = getMoonDistance(targetDate);

    return {
      phase,
      illumination: Math.round(illumination * 100) / 100,
      ageDays: Math.round(ageDays * 100) / 100,
      observedAt: targetDate.toISOString(),
      coordinate,
      distance,
    } as MoonPhaseData & { distance: number };
  }, [coordinate, date]);

  return {
    moonData,
    isLoading: false,
    error: null,
  };
}
