'use client';

import { useMap } from 'react-leaflet';

interface MapControlsProps {
  onResetView?: () => void;
}

export function MapControls({ onResetView }: MapControlsProps) {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const handleResetView = () => {
    if (onResetView) {
      onResetView();
    } else {
      map.setView([-2.5, 118], 5);
    }
  };

  const handleLocateMe = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 12);
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  return (
    <div className="absolute bottom-8 left-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={handleZoomIn}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-space-elevated/90 text-moonlight-muted backdrop-blur-sm transition-all hover:bg-space-elevated hover:text-cyber-cyan"
        aria-label="Zoom in"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      <button
        onClick={handleZoomOut}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-space-elevated/90 text-moonlight-muted backdrop-blur-sm transition-all hover:bg-space-elevated hover:text-cyber-cyan"
        aria-label="Zoom out"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      <button
        onClick={handleLocateMe}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-space-elevated/90 text-moonlight-muted backdrop-blur-sm transition-all hover:bg-space-elevated hover:text-cyber-cyan"
        aria-label="Locate me"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        </svg>
      </button>

      <button
        onClick={handleResetView}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-space-elevated/90 text-moonlight-muted backdrop-blur-sm transition-all hover:bg-space-elevated hover:text-cyber-cyan"
        aria-label="Reset view"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>
    </div>
  );
}
