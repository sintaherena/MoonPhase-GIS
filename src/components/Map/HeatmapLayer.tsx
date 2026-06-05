'use client';

import { useMemo } from 'react';
import { CircleMarker } from 'react-leaflet';
import SunCalc from 'suncalc3';
import type { GeoCoordinate } from '@/types';

export interface HeatmapLayerProps {
  isVisible: boolean;
  center: GeoCoordinate;
  date: Date;
  gridSize?: number;
  radiusKm?: number;
}

interface GridPoint {
  lat: number;
  lng: number;
  illumination: number;
}

/**
 * Calculate illumination for a grid of points around a center coordinate.
 */
function calculateGridIllumination(
  center: GeoCoordinate,
  date: Date,
  gridSize: number,
  radiusDeg: number
): GridPoint[] {
  const points: GridPoint[] = [];
  const step = (radiusDeg * 2) / (gridSize - 1);

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const lat = center.lat - radiusDeg + i * step;
      const lng = center.lng - radiusDeg + j * step;

      try {
        const illumination = SunCalc.getMoonIllumination(date);
        points.push({
          lat,
          lng,
          illumination: illumination.fraction,
        });
      } catch {
        points.push({ lat, lng, illumination: 0 });
      }
    }
  }

  return points;
}

export function HeatmapLayer({
  isVisible,
  center,
  date,
  gridSize = 15,
  radiusKm = 500,
}: HeatmapLayerProps) {
  // Convert km to approximate degrees (1 degree ≈ 111 km)
  const radiusDeg = radiusKm / 111;

  const gridPoints = useMemo(() => {
    if (!isVisible) return [];
    return calculateGridIllumination(center, date, gridSize, radiusDeg);
  }, [isVisible, center, date, gridSize, radiusDeg]);

  if (!isVisible || gridPoints.length === 0) return null;

  return (
    <>
      {gridPoints.map((point, index) => {
        // Color gradient: transparent to cyber-cyan based on illumination
        const opacity = 0.1 + point.illumination * 0.5;
        const radius = 8 + point.illumination * 12;

        return (
          <CircleMarker
            key={`${point.lat}-${point.lng}-${index}`}
            center={[point.lat, point.lng]}
            radius={radius}
            pathOptions={{
              fillColor: '#22D3EE',
              fillOpacity: opacity,
              stroke: false,
            }}
          />
        );
      })}
    </>
  );
}
