'use client';

import { useCallback, useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import type { LatLngLiteral, LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { GeoCoordinate, MapClickPayload } from '@/types';
import { MapControls } from './MapControls';
import { TooltipInfo } from './TooltipInfo';

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
  onHover,
}: {
  onMapClick?: (payload: MapClickPayload) => void;
  onHover?: (coordinate: GeoCoordinate | null) => void;
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
    mousemove(event: LeafletMouseEvent) {
      if (!onHover) return;

      onHover({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    },
    mouseout() {
      if (onHover) {
        onHover(null);
      }
    },
  });

  return null;
}

function GeolocationHandler({
  onLocationFound,
}: {
  onLocationFound: (coordinate: GeoCoordinate) => void;
}) {
  useMapEvents({
    locationfound(event) {
      onLocationFound({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Location permission granted, map will handle it
        },
        () => {
          // Graceful degradation - continue with default location
        }
      );
    }
  }, []);

  return null;
}

export function MoonMap({
  className,
  initialCenter,
  initialZoom = DEFAULT_ZOOM,
  onMapClick,
}: MoonMapProps) {
  const [lastClick, setLastClick] = useState<GeoCoordinate | null>(null);
  const [hoverCoord, setHoverCoord] = useState<GeoCoordinate | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

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

  const handleHover = useCallback((coord: GeoCoordinate | null) => {
    setHoverCoord(coord);
  }, []);

  const handleLocationFound = useCallback((coord: GeoCoordinate) => {
    console.log('Geolocation found:', coord);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleResetView = useCallback(() => {
    setLastClick(null);
  }, []);

  return (
    <div
      className={`relative ${className ?? 'h-full w-full'}`}
      onMouseMove={handleMouseMove}
      style={{ minHeight: '100vh', minWidth: '100vw' }}
    >
      <MapContainer
        center={center}
        zoom={initialZoom}
        scrollWheelZoom
        className="h-full w-full"
        style={{ minHeight: '100vh', minWidth: '100vw', background: '#0B0E14' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={CARTO_DARK_TILE_URL}
          subdomains="abcd"
          maxZoom={20}
        />
        <MapClickHandler onMapClick={handleMapClick} onHover={handleHover} />
        <GeolocationHandler onLocationFound={handleLocationFound} />
        <MapControls onResetView={handleResetView} />
      </MapContainer>

      <TooltipInfo coordinate={hoverCoord} isVisible={!!hoverCoord} position={mousePos} />

      {lastClick && (
        <div className="absolute bottom-4 left-4 z-[1000] rounded-lg bg-space-elevated/90 px-4 py-3 font-mono text-sm text-moonlight-muted backdrop-blur-sm">
          <div className="flex flex-col gap-1">
            <span className="text-cyber-cyan">
              Lat: {lastClick.lat.toFixed(6)}°
            </span>
            <span className="text-cyber-cyan">
              Lng: {lastClick.lng.toFixed(6)}°
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
