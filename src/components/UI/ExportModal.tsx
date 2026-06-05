'use client';

import { useState, useCallback } from 'react';
import type { GeoCoordinate } from '@/types';
import type { PinData } from '@/hooks/useMultiPin';
import { encodeState } from '@/lib/stateCodec';

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  pins: PinData[];
  date: Date;
  mapCenter: GeoCoordinate;
  zoom: number;
}

export function ExportModal({
  isOpen,
  onClose,
  pins,
  date,
  mapCenter,
  zoom,
}: ExportModalProps) {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportJSON = useCallback(() => {
    setIsExporting(true);

    try {
      const exportData = {
        appName: 'MoonPhase GIS',
        exportDate: new Date().toISOString(),
        selectedDate: date.toISOString(),
        mapCenter,
        zoom,
        pins: pins.map((pin) => ({
          id: pin.id,
          label: pin.label,
          color: pin.color,
          coordinate: pin.coordinate,
          moonData: pin.moonData
            ? {
                phase: pin.moonData.phase,
                phaseLabel: pin.moonData.phaseLabel,
                illumination: pin.moonData.illumination,
                distance: pin.moonData.distance,
                azimuth: pin.moonData.azimuth,
                elevation: pin.moonData.elevation,
                moonrise: pin.moonData.moonrise?.toISOString() ?? null,
                moonset: pin.moonData.moonset?.toISOString() ?? null,
                ageDays: pin.moonData.ageDays,
              }
            : null,
        })),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `moonphase-export-${date.toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  }, [pins, date, mapCenter, zoom]);

  const handleCopyShareLink = useCallback(async () => {
    try {
      const encoded = encodeState(pins, date, mapCenter, zoom);
      const shareUrl = `${window.location.origin}${window.location.pathname}?state=${encoded}`;

      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  }, [pins, date, mapCenter, zoom]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative mx-4 w-full max-w-md rounded-xl border border-white/10 bg-space-surface p-6 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-moonlight">Ekspor & Bagikan</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-moonlight-muted transition-colors hover:bg-white/10 hover:text-moonlight"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Export options */}
        <div className="space-y-4">
          {/* JSON Export */}
          <button
            onClick={handleExportJSON}
            disabled={isExporting}
            className="flex w-full items-center gap-4 rounded-lg border border-white/10 bg-space-elevated/50 p-4 text-left transition-all hover:border-cyber-cyan/30 hover:bg-space-elevated"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyber-cyan/10">
              <svg
                className="h-6 w-6 text-cyber-cyan"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-moonlight">Ekspor sebagai JSON</p>
              <p className="mt-0.5 text-xs text-moonlight-muted">
                Unduh data pin & bulan sebagai file JSON
              </p>
            </div>
            {isExporting && (
              <svg
                className="h-5 w-5 animate-spin text-cyber-cyan"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
          </button>

          {/* Share Link */}
          <button
            onClick={handleCopyShareLink}
            className="flex w-full items-center gap-4 rounded-lg border border-white/10 bg-space-elevated/50 p-4 text-left transition-all hover:border-cyber-cyan/30 hover:bg-space-elevated"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
              <svg
                className="h-6 w-6 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-moonlight">Salin Tautan Berbagi</p>
              <p className="mt-0.5 text-xs text-moonlight-muted">
                Bagikan state saat ini melalui URL
              </p>
            </div>
            {copied && (
              <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
                Tersalin!
              </span>
            )}
          </button>
        </div>

        {/* Footer info */}
        <p className="mt-6 text-center text-xs text-moonlight-muted">
          {pins.length} pin • {date.toLocaleDateString('id-ID')}
        </p>
      </div>
    </div>
  );
}
