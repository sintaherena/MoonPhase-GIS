'use client';

import { useState, useCallback, Component, type ReactNode, Suspense } from 'react';
import { MoonMap, CustomMarker } from '@/components/Map';
import { PanelShell } from '@/components/UI/PanelShell';
import { DateSelector } from '@/components/UI/DateSelector';
import { SkeletonSidebar } from '@/components/UI/SkeletonSidebar';
import { MoonInfo } from '@/components/Sidebar/MoonInfo';
import { Visualizer } from '@/components/Sidebar/Visualizer';
import { Timeline } from '@/components/Sidebar/Timeline';
import { useMapSync } from '@/hooks/useMapSync';
import { useMoonData } from '@/hooks/useMoonData';

/**
 * Simple error boundary for the sidebar content.
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class SidebarErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <p className="text-sm text-red-400">Terjadi kesalahan</p>
            <p className="font-mono text-xs text-moonlight-muted">
              {this.state.error?.message ?? 'Unknown error'}
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

function HomePageContent() {
  const { coordinate, setCoordinate } = useMapSync();
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const { moonData, isLoading, error } = useMoonData(coordinate, selectedDate);

  const handleMapClick = useCallback(
    (payload: { coordinate: { lat: number; lng: number }; timestamp: string }) => {
      setCoordinate(payload.coordinate);
    },
    [setCoordinate]
  );

  const handleDateChange = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  return (
    <main className="relative flex h-screen w-full overflow-hidden bg-space-deep">
      {/* Map section */}
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

      {/* Sidebar panel */}
      <section
        className="pointer-events-auto absolute right-0 top-0 z-10 flex h-full w-full max-w-md flex-col p-4 sm:p-6"
        aria-label="Panel data astronomi"
      >
        <PanelShell title="Data Astronomi">
          <div className="panel-scroll flex flex-1 flex-col gap-4 overflow-y-auto">
            {/* Date selector at top */}
            <DateSelector date={selectedDate} onChange={handleDateChange} />

            {/* Error display */}
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                {error}
              </div>
            )}

            {/* Loading state */}
            {isLoading ? (
              <SkeletonSidebar />
            ) : (
              <SidebarErrorBoundary>
                {/* Moon visualization */}
                {coordinate && moonData && (
                  <div className="flex justify-center py-2">
                    <Visualizer
                      phase={moonData.phase}
                      illumination={moonData.illumination}
                      size={180}
                    />
                  </div>
                )}

                {/* Moon info panel */}
                <MoonInfo data={moonData} />

                {/* Timeline */}
                {coordinate && moonData && (
                  <Timeline
                    moonrise={moonData.moonrise}
                    moonset={moonData.moonset}
                    now={new Date()}
                  />
                )}
              </SidebarErrorBoundary>
            )}
          </div>
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
