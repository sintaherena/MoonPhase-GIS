'use client';

import type { PinData } from '@/hooks/useMultiPin';
import { getPhaseLabel } from '@/lib/moonCalc';

export interface ComparisonPanelProps {
  pins: PinData[];
  selectedPinId: string | null;
  onSelectPin: (id: string) => void;
  onRemovePin: (id: string) => void;
  onAddPin: () => void;
  onClearAll: () => void;
  isMultiPinMode: boolean;
  maxPins: number;
}

function formatTime(date: Date | null): string {
  if (!date) return '--:--';
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function formatDistance(km: number): string {
  if (km >= 1000) {
    return `${(km / 1000).toFixed(2)} juta km`;
  }
  return `${km.toFixed(0)} km`;
}

export function ComparisonPanel({
  pins,
  selectedPinId,
  onSelectPin,
  onRemovePin,
  onAddPin,
  onClearAll,
  isMultiPinMode,
  maxPins,
}: ComparisonPanelProps) {
  if (!isMultiPinMode) {
    return (
      <div className="rounded-lg border border-white/10 bg-space-elevated/50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-moonlight">Mode Multi-Pin</h3>
            <p className="mt-1 text-xs text-moonlight-muted">
              Bandingkan data bulan dari beberapa lokasi
            </p>
          </div>
          <button
            onClick={onAddPin}
            className="rounded-lg bg-cyber-cyan/20 px-3 py-1.5 text-xs font-medium text-cyber-cyan transition-colors hover:bg-cyber-cyan/30"
          >
            Aktifkan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/10 bg-space-elevated/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-moonlight">
          Perbandingan Pin ({pins.length}/{maxPins})
        </h3>
        <div className="flex gap-2">
          {pins.length < maxPins && (
            <button
              onClick={onAddPin}
              className="rounded-lg bg-cyber-cyan/20 px-2 py-1 text-xs font-medium text-cyber-cyan transition-colors hover:bg-cyber-cyan/30"
            >
              + Tambah
            </button>
          )}
          {pins.length > 0 && (
            <button
              onClick={onClearAll}
              className="rounded-lg bg-red-500/20 px-2 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/30"
            >
              Hapus Semua
            </button>
          )}
        </div>
      </div>

      {pins.length === 0 ? (
        <div className="py-4 text-center text-xs text-moonlight-muted">
          Klik peta untuk menambahkan pin perbandingan
        </div>
      ) : (
        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-5 gap-1 px-2 text-[10px] font-medium uppercase tracking-wider text-moonlight-muted">
            <span>Lokasi</span>
            <span>Fase</span>
            <span>Cahaya</span>
            <span>Terbit</span>
            <span>Jarak</span>
          </div>

          {/* Pin rows */}
          {pins.map((pin) => (
            <div
              key={pin.id}
              onClick={() => onSelectPin(pin.id)}
              className={`grid cursor-pointer grid-cols-5 gap-1 rounded-lg px-2 py-2 text-xs transition-all ${
                selectedPinId === pin.id
                  ? 'bg-white/10 ring-1 ring-white/20'
                  : 'hover:bg-white/5'
              }`}
            >
              {/* Location label with color dot */}
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: pin.color }}
                />
                <span className="truncate text-moonlight">{pin.label}</span>
              </div>

              {/* Phase */}
              <span className="truncate text-moonlight-muted">
                {pin.moonData ? getPhaseLabel(pin.moonData.phase) : '--'}
              </span>

              {/* Illumination */}
              <span className="text-moonlight-muted">
                {pin.moonData ? `${(pin.moonData.illumination * 100).toFixed(0)}%` : '--'}
              </span>

              {/* Moonrise */}
              <span className="text-moonlight-muted">
                {pin.moonData ? formatTime(pin.moonData.moonrise) : '--'}
              </span>

              {/* Distance */}
              <span className="text-moonlight-muted">
                {pin.moonData ? formatDistance(pin.moonData.distance) : '--'}
              </span>
            </div>
          ))}

          {/* Remove buttons */}
          {pins.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {pins.map((pin) => (
                <button
                  key={pin.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemovePin(pin.id);
                  }}
                  className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] transition-colors hover:bg-white/10"
                  style={{ color: pin.color }}
                >
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: pin.color }}
                  />
                  ✕
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
