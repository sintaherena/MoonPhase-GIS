'use client';

import { useMemo, useState, useEffect } from 'react';
import type { GeoCoordinate, MoonDetailData } from '@/types';
import { getMoonData } from '@/lib/moonCalc';

interface UseMoonDataResult {
  moonData: MoonDetailData | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to calculate moon data for a given coordinate and date.
 * Uses SunCalc3 for accurate astronomical calculations.
 * Returns a loading state briefly to allow for skeleton UI transitions.
 */
export function useMoonData(
  coordinateOrOptions: GeoCoordinate | null | { coordinate: GeoCoordinate | null; date?: Date },
  maybeDate?: Date
): UseMoonDataResult {
  // Support both (coordinate, date) and ({ coordinate, date }) calling conventions
  const coordinate = useMemo(() => {
    if (!coordinateOrOptions) return null;
    if ('lat' in coordinateOrOptions) return coordinateOrOptions;
    return coordinateOrOptions.coordinate;
  }, [coordinateOrOptions]);

  const date = useMemo(() => {
    if (maybeDate) return maybeDate;
    if (coordinateOrOptions && 'date' in coordinateOrOptions && coordinateOrOptions.date) {
      return coordinateOrOptions.date;
    }
    return new Date();
  }, [maybeDate, coordinateOrOptions]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize the moon data calculation
  const moonData = useMemo(() => {
    if (!coordinate) {
      return null;
    }

    try {
      setError(null);
      return getMoonData(coordinate, date);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Gagal menghitung data bulan';
      setError(message);
      return null;
    }
  }, [coordinate, date]);

  // Simulate a brief loading state for skeleton transitions
  useEffect(() => {
    if (!coordinate) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [coordinate, date]);

  return { moonData, isLoading, error };
}
