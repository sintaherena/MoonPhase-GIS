'use client';

import { useCallback, useEffect, useState } from 'react';
import type { GeoCoordinate } from '@/types';

export function useMapSync(defaultCoordinate?: GeoCoordinate) {
  const [coord, setCoord] = useState<GeoCoordinate | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (hasInitialized) return;

    // Check URL params on client side
    const params = new URLSearchParams(window.location.search);
    const latParam = params.get('lat');
    const lngParam = params.get('lng');

    if (latParam && lngParam) {
      const lat = parseFloat(latParam);
      const lng = parseFloat(lngParam);
      if (!isNaN(lat) && !isNaN(lng)) {
        setCoord({ lat, lng });
      }
    } else if (defaultCoordinate) {
      setCoord(defaultCoordinate);
    }

    setHasInitialized(true);
  }, [defaultCoordinate, hasInitialized]);

  const updateURL = useCallback((c: GeoCoordinate) => {
    const params = new URLSearchParams();
    params.set('lat', c.lat.toFixed(6));
    params.set('lng', c.lng.toFixed(6));
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  }, []);

  const setCoordinate = useCallback(
    (c: GeoCoordinate | null) => {
      setCoord(c);
      if (c) {
        updateURL(c);
      }
    },
    [updateURL]
  );

  return {
    coordinate: coord,
    setCoordinate,
    hasURLParams: hasInitialized && coord !== null,
  };
}
