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

const HeatmapLayerDynamic = dynamic(
  () => import('./HeatmapLayer').then((mod) => mod.HeatmapLayer),
  { ssr: false }
);

const SearchBarDynamic = dynamic(
  () => import('./SearchBar').then((mod) => mod.SearchBar),
  { ssr: false }
);

export function MoonMap(props: MoonMapProps) {
  return <MoonMapDynamic {...props} />;
}

export function CustomMarker(props: CustomMarkerProps) {
  return <CustomMarkerDynamic {...props} />;
}

export function HeatmapLayer(props: React.ComponentProps<typeof import('./HeatmapLayer').HeatmapLayer>) {
  return <HeatmapLayerDynamic {...props} />;
}

export function SearchBar(props: React.ComponentProps<typeof import('./SearchBar').SearchBar>) {
  return <SearchBarDynamic {...props} />;
}

// Re-export directly - no dynamic wrapper for components that use useMap()
// They must be rendered inside MapContainer context
export { MapControls } from './MapControls';
export { TooltipInfo } from './TooltipInfo';

export type { MoonMapProps } from './MoonMap';
export type { CustomMarkerProps } from './CustomMarker';
export type { HeatmapLayerProps } from './HeatmapLayer';
export type { SearchBarProps } from './SearchBar';
