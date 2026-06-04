'use client';

import { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { GeoCoordinate, MoonPhaseName } from '@/types';

export interface CustomMarkerProps {
  coordinate: GeoCoordinate;
  phase: MoonPhaseName;
}

/**
 * Generate SVG icon based on moon phase
 */
function getMoonPhaseIcon(phase: MoonPhaseName): string {
  const svgNS = 'http://www.w3.org/2000/svg';

  const phaseConfig: Record<MoonPhaseName, { path: string; color: string }> = {
    new_moon: {
      path: 'M20,10 A10,10 0 1,1 20,10.01 Z',
      color: '#1a1a2e',
    },
    waxing_crescent: {
      path: 'M20,10 A10,10 0 1,1 20,10.01 Z M20,10 A7,10 0 1,0 20,10.01 Z',
      color: '#f0e68c',
    },
    first_quarter: {
      path: 'M20,10 A10,10 0 1,1 20,10.01 Z M20,10 A10,10 0 0,0 20,10.01 Z',
      color: '#f0e68c',
    },
    waxing_gibbous: {
      path: 'M20,10 A10,10 0 1,1 20,10.01 Z M20,10 A7,10 0 0,1 20,10.01 Z',
      color: '#f0e68c',
    },
    full_moon: {
      path: 'M20,10 A10,10 0 1,1 20,10.01 Z',
      color: '#ffd700',
    },
    waning_gibbous: {
      path: 'M20,10 A10,10 0 1,1 20,10.01 Z M20,10 A7,10 0 1,0 20,10.01 Z',
      color: '#f0e68c',
    },
    last_quarter: {
      path: 'M20,10 A10,10 0 1,1 20,10.01 Z M20,10 A10,10 0 0,1 20,10.01 Z',
      color: '#f0e68c',
    },
    waning_crescent: {
      path: 'M20,10 A10,10 0 1,1 20,10.01 Z M20,10 A7,10 0 0,0 20,10.01 Z',
      color: '#f0e68c',
    },
  };

  const config = phaseConfig[phase] || phaseConfig.new_moon;

  const svg = `
    <svg xmlns="${svgNS}" viewBox="0 0 40 40" width="40" height="40">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <circle cx="20" cy="20" r="12" fill="${config.color}" filter="url(#glow)" opacity="0.9"/>
      <circle cx="20" cy="20" r="10" fill="${phase === 'full_moon' ? config.color : '#0f0f1a'}" />
      <path d="${config.path}" fill="${config.color}" transform="scale(0.8) translate(5, 5)"/>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function CustomMarker({ coordinate, phase }: CustomMarkerProps) {
  const iconUrl = useMemo(() => getMoonPhaseIcon(phase), [phase]);

  const icon = useMemo(() => {
    if (typeof window === 'undefined') return null;

    return L.divIcon({
      html: `<img src="${iconUrl}" style="width: 40px; height: 40px; animation: pulse 2s ease-in-out infinite;" />`,
      className: 'moon-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  }, [iconUrl]);

  if (!icon) return null;

  return (
    <Marker position={[coordinate.lat, coordinate.lng]} icon={icon}>
      <Popup>
        <div className="text-center">
          <p className="font-bold text-gray-800">Fase Bulan</p>
          <p className="text-sm text-gray-600">{phase.replace(/_/g, ' ').toUpperCase()}</p>
        </div>
      </Popup>
    </Marker>
  );
}
