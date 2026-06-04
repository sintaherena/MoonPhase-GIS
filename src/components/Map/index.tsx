'use client';

import dynamic from 'next/dynamic';
import type { MoonMapProps } from './MoonMap';
import type { CustomMarkerProps } from './CustomMarker';

const MoonMapDynamic = dynamic(
  () => import('./MoonMap').then((mod) => mod.MoonMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-full min-h-[400px] w-full items-center justify-center rounded-lg bg-space-deep text-moonlight-muted"
        role="status"
        aria-label="Loading map"
      >
        <span className="font-mono text-sm">Initializing lunar map…</span>
      </div>
    ),
  }
);

const CustomMarkerDynamic = dynamic(
  () => import('./CustomMarker').then((mod) => mod.CustomMarker),
  { ssr: false }
);

const MapControlsDynamic = dynamic(
  () => import('./MapControls').then((mod) => mod.MapControls),
  { ssr: false }
);

const TooltipInfoDynamic = dynamic(
  () => import('./TooltipInfo').then((mod) => mod.TooltipInfo),
  { ssr: false }
);

export function MoonMap(props: MoonMapProps) {
  return <MoonMapDynamic {...props} />;
}

export function CustomMarker(props: CustomMarkerProps) {
  return <CustomMarkerDynamic {...props} />;
}

export function MapControls(props: { onResetView?: () => void }) {
  return <MapControlsDynamic {...props} />;
}

export function TooltipInfo(props: {
  coordinate: { lat: number; lng: number } | null;
  isVisible: boolean;
  position?: { x: number; y: number } | null;
}) {
  return <TooltipInfoDynamic {...props} />;
}

export type { MoonMapProps } from './MoonMap';
export type { CustomMarkerProps } from './CustomMarker';
