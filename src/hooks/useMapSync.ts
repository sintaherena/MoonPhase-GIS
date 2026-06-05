'use client';

import { useCallback, useEffect, useState } from 'react';
import type { GeoCoordinate } from '@/types';
import { decodeState, type EncodedState } from '@/lib/stateCodec';

export interface UseMapSyncResult {
  coordinate: GeoCoordinate | null;
  setCoordinate: (c: GeoCoordinate | null) => void;
  hasURLParams: boolean;
  sharedState: EncodedState | null;
  clearSharedState: () => void;
}

export function useMapSync(defaultCoordinate?: GeoCoordinate): UseMapSyncResult {
  const [coord, setCoord] = useState<GeoCoordinate | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [sharedState, setSharedState] = useState<EncodedState | null>(null);

  useEffect(() => {
    if (hasInitialized) return;

    // Check URL params on client side
    const params = new URLSearchParams(window.location.search);

    // Check for encoded shared state
    const stateParam = params.get('state');
    if (stateParam) {
      const decoded = decodeState(stateParam);
      if (decoded) {
        setSharedState(decoded);
        // Use the first pin's coordinate or map center
        if (decoded.pins.length > 0) {
          setCoord(decoded.pins[0].coordinate);
        } else {
          setCoord(decoded.mapCenter);
        }
        setHasInitialized(true);
        return;
      }
    }

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

  const clearSharedState = useCallback(() => {
    setSharedState(null);
  }, []);

  return {
    coordinate: coord,
    setCoordinate,
    hasURLParams: hasInitialized && coord !== null,
    sharedState,
    clearSharedState,
  };
}
