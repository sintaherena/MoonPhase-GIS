'use client';

import { MoonMap } from '@/components/Map';
import { PanelShell } from '@/components/UI/PanelShell';
import { useGeoCoordinate } from '@/hooks/useGeoCoordinate';

export default function HomePage() {
  const { coordinate, handleMapClick } = useGeoCoordinate();

  return (
    <main className="relative flex h-screen w-full overflow-hidden bg-space-deep">
      <section className="relative flex-1" aria-label="Peta interaktif">
        <MoonMap className="absolute inset-0 h-full w-full" onMapClick={handleMapClick} />
      </section>

      <section
        className="pointer-events-auto absolute right-0 top-0 z-10 flex h-full w-full max-w-md flex-col p-4 sm:p-6"
        aria-label="Panel data astronomi"
      >
        <PanelShell title="Data Astronomi">
          <p className="text-moonlight-muted">
            Klik pada peta untuk memilih koordinat observasi. Data fase bulan akan
            ditampilkan di sini pada fase berikutnya.
          </p>
          {coordinate ? (
            <dl className="mt-4 space-y-2 font-mono text-xs text-cyber-cyan">
              <div className="flex justify-between gap-4">
                <dt className="text-moonlight-muted">Latitude</dt>
                <dd>{coordinate.lat.toFixed(6)}°</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-moonlight-muted">Longitude</dt>
                <dd>{coordinate.lng.toFixed(6)}°</dd>
              </div>
            </dl>
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
