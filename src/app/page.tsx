'use client';

import { Suspense } from 'react';
import { MoonMap, CustomMarker } from '@/components/Map';
import { PanelShell } from '@/components/UI/PanelShell';
import { useMapSync } from '@/hooks/useMapSync';
import { useMoonData } from '@/hooks/useMoonData';

function HomePageContent() {
  const { coordinate, setCoordinate } = useMapSync();
  const { moonData } = useMoonData({ coordinate });

  const handleMapClick = (payload: { coordinate: { lat: number; lng: number }; timestamp: string }) => {
    setCoordinate(payload.coordinate);
  };

  return (
    <main className="relative flex h-screen w-full overflow-hidden bg-space-deep">
      <section className="relative flex-1" aria-label="Peta interaktif">
        <MoonMap
          className="absolute inset-0 h-full w-full"
          onMapClick={handleMapClick}
          initialCenter={coordinate ?? undefined}
        />

        {coordinate && moonData && (
          <div className="absolute left-1/2 top-4 z-[1000] -translate-x-1/2">
            <CustomMarker coordinate={coordinate} phase={moonData.phase} />
          </div>
        )}
      </section>

      <section
        className="pointer-events-auto absolute right-0 top-0 z-10 flex h-full w-full max-w-md flex-col p-4 sm:p-6"
        aria-label="Panel data astronomi"
      >
        <PanelShell title="Data Astronomi">
          <p className="text-moonlight-muted">
            Klik pada peta untuk memilih koordinat observasi. Data fase bulan akan
            ditampilkan di sini.
          </p>

          {coordinate ? (
            <div className="mt-4 space-y-4">
              <dl className="space-y-2 font-mono text-xs text-cyber-cyan">
                <div className="flex justify-between gap-4">
                  <dt className="text-moonlight-muted">Latitude</dt>
                  <dd>{coordinate.lat.toFixed(6)}°</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-moonlight-muted">Longitude</dt>
                  <dd>{coordinate.lng.toFixed(6)}°</dd>
                </div>
              </dl>

              {moonData && (
                <div className="rounded-lg bg-space-elevated/50 p-3">
                  <h3 className="mb-2 font-mono text-sm font-bold text-lunar-silver">
                    Fase Bulan
                  </h3>
                  <dl className="space-y-1 font-mono text-xs">
                    <div className="flex justify-between gap-4">
                      <dt className="text-moonlight-muted">Fase</dt>
                      <dd className="text-lunar-silver">
                        {moonData.phase.replace(/_/g, ' ').toUpperCase()}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-moonlight-muted">Iluminasi</dt>
                      <dd className="text-lunar-silver">
                        {(moonData.illumination * 100).toFixed(1)}%
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-moonlight-muted">Usia (hari)</dt>
                      <dd className="text-lunar-silver">{moonData.ageDays}</dd>
                    </div>
                    {moonData.distance && (
                      <div className="flex justify-between gap-4">
                        <dt className="text-moonlight-muted">Jarak</dt>
                        <dd className="text-lunar-silver">
                          {(moonData.distance / 1000).toFixed(0)} ribu km
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}
            </div>
          ) : (
            <p className="mt-4 font-mono text-xs text-moonlight-muted/80">
              Belum ada koordinat dipilih.
            </p>
          )}
        </PanelShell>
      </section>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-space-deep">
          <span className="font-mono text-moonlight-muted">Loading...</span>
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
