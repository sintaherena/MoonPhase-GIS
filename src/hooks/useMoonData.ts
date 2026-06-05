'use client';

import { useMemo, useState, useEffect } from 'react';
import type { GeoCoordinate, MoonDetailData } from '@/types';
import { getMoonData } from '@/lib/moonCalc';

interface UseMoonDataResult {
  data: MoonDetailData | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to calculate moon data for a given coordinate and date.
 * Returns a loading state briefly to allow for skeleton UI transitions.
 */
export function useMoonData(
  coordinate: GeoCoordinate | null,
  date: Date
): UseMoonDataResult {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize the moon data calculation
  const data = useMemo(() => {
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

  return { data, isLoading, error };
}
