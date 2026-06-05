'use client';

import { memo } from 'react';
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
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function formatDistance(km: number): string {
  if (km >= 1_000_000) {
    return `${(km / 1_000_000).toFixed(2)}M km`;
  }
  if (km >= 1000) {
    return `${(km / 1000).toFixed(2)}k km`;
  }
  return `${km.toFixed(0)} km`;
}

export const ComparisonPanel = memo(function ComparisonPanel({
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
      <div className="rounded-lg border border-white/10 bg-space-elevated/50 p-4" role="region" aria-label="Multi-pin mode">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-moonlight">Multi-Pin Mode</h2>
            <p className="mt-1 text-xs text-moonlight-muted">
              Compare lunar data across multiple locations
            </p>
          </div>
          <button
            onClick={onAddPin}
            className="rounded-lg bg-cyber-cyan/20 px-3 py-1.5 text-xs font-medium text-cyber-cyan transition-colors hover:bg-cyber-cyan/30"
          >
            Enable
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/10 bg-space-elevated/50 p-4" role="region" aria-label="Pin comparison">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-moonlight">
          Pin Comparison ({pins.length}/{maxPins})
        </h2>
        <div className="flex gap-2">
          {pins.length < maxPins && (
            <button
              onClick={onAddPin}
              className="rounded-lg bg-cyber-cyan/20 px-2 py-1 text-xs font-medium text-cyber-cyan transition-colors hover:bg-cyber-cyan/30"
            >
              + Add
            </button>
          )}
          {pins.length > 0 && (
            <button
              onClick={onClearAll}
              className="rounded-lg bg-red-500/20 px-2 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/30"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {pins.length === 0 ? (
        <div className="py-4 text-center text-xs text-moonlight-muted" role="status" aria-live="polite">
          Click the map to add comparison pins
        </div>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-5 gap-1 px-2 text-[10px] font-medium uppercase tracking-wider text-moonlight-muted">
            <span>Location</span>
            <span>Phase</span>
            <span>Light</span>
            <span>Rise</span>
            <span>Distance</span>
          </div>

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
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: pin.color }}
                />
                <span className="truncate text-moonlight">{pin.label}</span>
              </div>

              <span className="truncate text-moonlight-muted">
                {pin.moonData ? getPhaseLabel(pin.moonData.phase) : '--'}
              </span>

              <span className="text-moonlight-muted">
                {pin.moonData ? `${(pin.moonData.illumination * 100).toFixed(0)}%` : '--'}
              </span>

              <span className="text-moonlight-muted">
                {pin.moonData ? formatTime(pin.moonData.moonrise) : '--'}
              </span>

              <span className="text-moonlight-muted">
                {pin.moonData ? formatDistance(pin.moonData.distance) : '--'}
              </span>
            </div>
          ))}

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
});
ComparisonPanel.displayName = 'ComparisonPanel';
