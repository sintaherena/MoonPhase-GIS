'use client';

import { useState, useCallback, useEffect, Component, type ReactNode, Suspense } from 'react';
import { MoonMap, CustomMarker, HeatmapLayer, SearchBar } from '@/components/Map';
import { PanelShell } from '@/components/UI/PanelShell';
import { DateSelector } from '@/components/UI/DateSelector';
import { SkeletonSidebar } from '@/components/UI/SkeletonSidebar';
import { MoonInfo } from '@/components/Sidebar/MoonInfo';
import { Visualizer } from '@/components/Sidebar/Visualizer';
import { Timeline } from '@/components/Sidebar/Timeline';
import { ComparisonPanel } from '@/components/Sidebar/ComparisonPanel';
import { ExportModal } from '@/components/UI/ExportModal';
import { OnboardingTour } from '@/components/UI/OnboardingTour';
import { useMapSync } from '@/hooks/useMapSync';
import { useMoonData } from '@/hooks/useMoonData';
import { useMultiPin, MAX_PINS } from '@/hooks/useMultiPin';
import type { GeoCoordinate } from '@/types';

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
            <p className="text-sm text-red-400">An error occurred</p>
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

function MapLoadingPlaceholder() {
  return (
    <div
      className="flex h-full min-h-[400px] w-full items-center justify-center bg-space-deep text-moonlight-muted"
      role="status"
      aria-label="Loading map"
    >
      <span className="font-mono text-sm">Initializing lunar map…</span>
    </div>
  );
}

function HomePageContent() {
  const [isMounted, setIsMounted] = useState(false);
  const { coordinate, setCoordinate, sharedState, clearSharedState } = useMapSync();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [showExportModal, setShowExportModal] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [mapCenter, setMapCenter] = useState<GeoCoordinate>({ lat: -2.5, lng: 118 });
  const [mapZoom] = useState(5);
  const [flyToTarget, setFlyToTarget] = useState<GeoCoordinate | null>(null);

  // Multi-pin state
  const {
    pins,
    selectedPinId,
    isMultiPinMode,
    addPin,
    removePin,
    selectPin,
    clearAllPins,
    toggleMultiPinMode,
  } = useMultiPin();

  const { moonData, isLoading, error } = useMoonData(coordinate, selectedDate);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle shared state from URL
  useEffect(() => {
    if (sharedState) {
      // Apply shared state
      if (sharedState.pins.length > 0) {
        sharedState.pins.forEach((pin) => {
          addPin(pin.coordinate, new Date(sharedState.date));
        });
      }
      if (sharedState.date) {
        setSelectedDate(new Date(sharedState.date));
      }
      clearSharedState();
    }
  }, [sharedState, addPin, clearSharedState]);

  const handleMapClick = useCallback(
    (payload: { coordinate: GeoCoordinate; timestamp: string }) => {
      setCoordinate(payload.coordinate);
      setMapCenter(payload.coordinate);
      setFlyToTarget(null); // Clear flyTo when user clicks manually

      // Add pin if in multi-pin mode
      if (isMultiPinMode) {
        addPin(payload.coordinate, selectedDate);
      }
    },
    [setCoordinate, isMultiPinMode, addPin, selectedDate]
  );

  const handleDateChange = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const handleLocationSelect = useCallback(
    (coord: GeoCoordinate) => {
      setCoordinate(coord);
      setMapCenter(coord);
      setFlyToTarget(coord); // Trigger flyTo animation
    },
    [setCoordinate]
  );

  const handleSelectPin = useCallback(
    (id: string) => {
      selectPin(id);
      const pin = pins.find((p) => p.id === id);
      if (pin) {
        setCoordinate(pin.coordinate);
        setFlyToTarget(pin.coordinate);
      }
    },
    [selectPin, pins, setCoordinate]
  );

  const handleAddPin = useCallback(() => {
    if (!isMultiPinMode) {
      toggleMultiPinMode();
    }
    if (coordinate && pins.length < MAX_PINS) {
      addPin(coordinate, selectedDate);
    }
  }, [isMultiPinMode, toggleMultiPinMode, coordinate, pins.length, addPin, selectedDate]);

  if (!isMounted) {
    return (
      <main className="relative flex h-screen w-full overflow-hidden bg-space-deep">
        <h1 className="sr-only">MoonPhase GIS - Lunar Phase Map</h1>
        <section id="map-section" className="relative flex-1" aria-label="Interactive map">
          <MapLoadingPlaceholder />
        </section>
        <section
          id="sidebar-section"
          className="pointer-events-auto absolute right-0 top-0 z-10 flex h-full w-full max-w-md flex-col p-4 sm:p-6"
          aria-label="Astronomical data panel"
        >
          <PanelShell title="Astronomical Data">
            <SkeletonSidebar />
          </PanelShell>
        </section>
      </main>
    );
  }

  return (
    <main className="relative flex h-screen w-full overflow-hidden bg-space-deep">
      {/* Visually hidden heading for accessibility */}
      <h1 className="sr-only">MoonPhase GIS - Lunar Phase Map</h1>

      {/* Map section */}
      <section id="map-section" className="relative flex-1" aria-label="Interactive map" role="application">
        <MoonMap
          className="absolute inset-0 h-full w-full"
          onMapClick={handleMapClick}
          initialCenter={coordinate ?? undefined}
          flyTo={flyToTarget}
        >
          <HeatmapLayer
            isVisible={showHeatmap}
            center={coordinate ?? mapCenter}
            date={selectedDate}
          />

          {/* Markers must be MapContainer descendants (react-leaflet context) */}
          {coordinate && moonData && !isMultiPinMode && (
            <CustomMarker coordinate={coordinate} phase={moonData.phase} />
          )}
          {isMultiPinMode &&
            pins.map((pin) => (
              <CustomMarker
                key={pin.id}
                coordinate={pin.coordinate}
                phase={pin.moonData?.phase ?? 'new_moon'}
                color={pin.color}
                label={pin.label}
              />
            ))}
        </MoonMap>

        {/* Search bar - floating over map (no longer uses useMap) */}
        <div id="search-section" className="absolute left-4 top-4 z-[1001]">
          <SearchBar onLocationSelect={handleLocationSelect} />
        </div>

        {/* Heatmap toggle */}
        <div className="absolute left-4 top-16 z-[1000]">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            aria-pressed={showHeatmap}
            aria-label={showHeatmap ? 'Nonaktifkan heatmap' : 'Aktifkan heatmap'}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
              showHeatmap
                ? 'border-cyber-cyan/30 bg-cyber-cyan/20 text-cyber-cyan'
                : 'border-white/10 bg-space-surface/95 text-moonlight-muted hover:border-white/20 hover:text-moonlight'
            } backdrop-blur-md`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
              />
            </svg>
            Heatmap
          </button>
        </div>

        {/* Export button */}
        <div className="absolute right-4 top-4 z-[1000]">
          <button
            onClick={() => setShowExportModal(true)}
            aria-label="Export moon data"
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-space-surface/95 px-3 py-2 text-xs font-medium text-moonlight-muted backdrop-blur-md transition-all hover:border-white/20 hover:text-moonlight"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Export
          </button>
        </div>

      </section>

      {/* Sidebar panel */}
      <section
        id="sidebar-section"
        className="pointer-events-auto absolute right-0 top-0 z-10 flex h-full w-full max-w-md flex-col p-4 sm:p-6"
        aria-label="Astronomical data panel"
        aria-live="polite"
      >
        <PanelShell title="Astronomical Data">
          <div className="panel-scroll flex flex-1 flex-col gap-4 overflow-y-auto">
            {/* Date selector at top */}
            <DateSelector date={selectedDate} onChange={handleDateChange} />

            {/* Multi-pin mode toggle */}
            <ComparisonPanel
              pins={pins}
              selectedPinId={selectedPinId}
              onSelectPin={handleSelectPin}
              onRemovePin={removePin}
              onAddPin={handleAddPin}
              onClearAll={clearAllPins}
              isMultiPinMode={isMultiPinMode}
              maxPins={MAX_PINS}
            />

            {/* Error display */}
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400" role="alert" aria-live="assertive">
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

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        pins={pins}
        date={selectedDate}
        mapCenter={mapCenter}
        zoom={mapZoom}
      />

      {/* Onboarding Tour */}
      <OnboardingTour />
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
