'use client';

import dynamic from 'next/dynamic';
import type { MoonMapProps } from './MoonMap';

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

export function MoonMap(props: MoonMapProps) {
  return <MoonMapDynamic {...props} />;
}

export type { MoonMapProps } from './MoonMap';
