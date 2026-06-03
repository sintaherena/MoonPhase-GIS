'use client';

import { useCallback, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import type { LatLngLiteral, LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { GeoCoordinate, MapClickPayload } from '@/types';

const CARTO_DARK_TILE_URL =
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

const DEFAULT_CENTER: LatLngLiteral = { lat: -2.5, lng: 118 };
const DEFAULT_ZOOM = 5;

export interface MoonMapProps {
  className?: string;
  initialCenter?: GeoCoordinate;
  initialZoom?: number;
  onMapClick?: (payload: MapClickPayload) => void;
}

function MapClickHandler({
  onMapClick,
}: {
  onMapClick?: (payload: MapClickPayload) => void;
}) {
  useMapEvents({
    click(event: LeafletMouseEvent) {
      if (!onMapClick) return;

      const coordinate: GeoCoordinate = {
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      };

      onMapClick({
        coordinate,
        timestamp: new Date().toISOString(),
      });
    },
  });

  return null;
}

export function MoonMap({
  className,
  initialCenter,
  initialZoom = DEFAULT_ZOOM,
  onMapClick,
}: MoonMapProps) {
  const [lastClick, setLastClick] = useState<GeoCoordinate | null>(null);

  const center: LatLngLiteral = initialCenter
    ? { lat: initialCenter.lat, lng: initialCenter.lng }
    : DEFAULT_CENTER;

  const handleMapClick = useCallback(
    (payload: MapClickPayload) => {
      setLastClick(payload.coordinate);
      onMapClick?.(payload);
    },
    [onMapClick]
  );

  return (
    <div className={`relative ${className ?? 'h-full w-full'}`}>
      <MapContainer
        center={center}
        zoom={initialZoom}
        scrollWheelZoom
        className="h-full w-full rounded-lg"
        style={{ minHeight: '400px', background: '#0B0E14' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={CARTO_DARK_TILE_URL}
          subdomains="abcd"
          maxZoom={20}
        />
        <MapClickHandler onMapClick={handleMapClick} />
      </MapContainer>

      {lastClick && (
        <p
          className="pointer-events-none absolute bottom-4 left-4 rounded-md bg-space-elevated/90 px-3 py-2 font-mono text-xs text-moonlight-muted backdrop-blur-sm"
          aria-live="polite"
        >
          Lat: {lastClick.lat.toFixed(5)} · Lng: {lastClick.lng.toFixed(5)}
        </p>
      )}
    </div>
  );
}
