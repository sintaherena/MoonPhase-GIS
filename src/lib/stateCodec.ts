import type { GeoCoordinate } from '@/types';
import type { PinData } from '@/hooks/useMultiPin';

export interface EncodedState {
  pins: Array<{
    coordinate: GeoCoordinate;
    color: string;
    label: string;
  }>;
  date: string;
  mapCenter: GeoCoordinate;
  zoom: number;
}

/**
 * Encode current application state to a base64 string for URL sharing.
 */
export function encodeState(
  pins: PinData[],
  date: Date,
  mapCenter: GeoCoordinate,
  zoom: number
): string {
  const state: EncodedState = {
    pins: pins.map((p) => ({
      coordinate: p.coordinate,
      color: p.color,
      label: p.label,
    })),
    date: date.toISOString(),
    mapCenter,
    zoom,
  };

  try {
    const json = JSON.stringify(state);
    return btoa(encodeURIComponent(json));
  } catch {
    return '';
  }
}

/**
 * Decode a base64-encoded state string back to application state.
 */
export function decodeState(encoded: string): EncodedState | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    const state = JSON.parse(json) as EncodedState;

    // Validate structure
    if (
      !state.pins ||
      !Array.isArray(state.pins) ||
      !state.date ||
      !state.mapCenter ||
      typeof state.zoom !== 'number'
    ) {
      return null;
    }

    return state;
  } catch {
    return null;
  }
}
