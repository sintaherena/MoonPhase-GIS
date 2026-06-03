'use client';

import { useCallback, useState } from 'react';
import type { GeoCoordinate, MapClickPayload } from '@/types';

export function useGeoCoordinate(initial?: GeoCoordinate | null) {
  const [coordinate, setCoordinate] = useState<GeoCoordinate | null>(
    initial ?? null
  );

  const handleMapClick = useCallback((payload: MapClickPayload) => {
    setCoordinate(payload.coordinate);
  }, []);

  const clearCoordinate = useCallback(() => {
    setCoordinate(null);
  }, []);

  return {
    coordinate,
    setCoordinate,
    handleMapClick,
    clearCoordinate,
  };
}
