'use client';

import { memo } from 'react';
import type { MoonDetailData } from '@/types';

export interface MoonInfoProps {
  data: MoonDetailData | null;
}

/**
 * Format a Date to "HH:mm" in the user's locale.
 */
function formatTime(date: Date | null): string {
  if (!date) return '--:--';
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Circular progress SVG for illumination percentage.
 */
function IlluminationArc({ value }: { value: number }) {
  const percentage = Math.round(value * 100);
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - value);

  return (
    <div className="relative flex h-16 w-16 items-center justify-center">
      <svg width="64" height="64" viewBox="0 0 64 64" className="rotate-[-90deg]">
        {/* Background circle */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="#1A2030"
          strokeWidth="4"
        />
        {/* Progress arc */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="#22D3EE"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <span className="absolute font-mono text-xs font-semibold text-cyber-cyan">
        {percentage}%
      </span>
    </div>
  );
}

/**
 * MoonInfo - Main info panel showing moon phase data.
 */
export const MoonInfo = memo(function MoonInfo({ data }: MoonInfoProps) {
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-moonlight-muted">
          Click on the map to select an observation coordinate.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Phase name header */}
      <h3 className="font-sans text-xl font-bold tracking-tight text-moonlight">
        {data.phaseLabel}
      </h3>

      {/* Illumination with circular arc */}
      <div className="flex items-center gap-4">
        <IlluminationArc value={data.illumination} />
        <div className="flex flex-col gap-1">
          <span className="font-sans text-sm text-moonlight-muted">Illumination</span>
          <span className="font-mono text-lg font-semibold text-cyber-cyan">
            {Math.round(data.illumination * 100)}%
          </span>
        </div>
      </div>

      {/* Data rows */}
      <dl className="space-y-3 border-t border-white/10 pt-4">
        {/* Distance */}
        <div className="flex items-center justify-between">
          <dt className="font-sans text-sm text-moonlight-muted">Distance</dt>
          <dd className="font-mono text-sm font-medium text-cyber-cyan">
            {Math.round(data.distance).toLocaleString('id-ID')} km
          </dd>
        </div>

        {/* Azimuth */}
        <div className="flex items-center justify-between">
          <dt className="font-sans text-sm text-moonlight-muted">Azimuth</dt>
          <dd className="font-mono text-sm font-medium text-cyber-cyan">
            {data.azimuth.toFixed(1)}°
          </dd>
        </div>

        {/* Elevation */}
        <div className="flex items-center justify-between">
          <dt className="font-sans text-sm text-moonlight-muted">Elevation</dt>
          <dd className="font-mono text-sm font-medium text-cyber-cyan">
            {data.elevation.toFixed(1)}°
          </dd>
        </div>

        {/* Age */}
        <div className="flex items-center justify-between">
          <dt className="font-sans text-sm text-moonlight-muted">Age</dt>
          <dd className="font-mono text-sm font-medium text-cyber-cyan">
            {data.ageDays.toFixed(1)} days
          </dd>
        </div>

        {/* Moonrise */}
        <div className="flex items-center justify-between">
          <dt className="font-sans text-sm text-moonlight-muted">Moonrise</dt>
          <dd className="font-mono text-sm font-medium text-cyber-cyan">
            {formatTime(data.moonrise)}
          </dd>
        </div>

        {/* Moonset */}
        <div className="flex items-center justify-between">
          <dt className="font-sans text-sm text-moonlight-muted">Moonset</dt>
          <dd className="font-mono text-sm font-medium text-cyber-cyan">
            {formatTime(data.moonset)}
          </dd>
        </div>
      </dl>

      {/* Coordinates */}
      <div className="border-t border-white/10 pt-3">
        <dl className="space-y-2 font-mono text-xs">
          <div className="flex justify-between">
            <dt className="text-moonlight-muted">Lat</dt>
            <dd className="text-cyber-cyan">{data.coordinate.lat.toFixed(6)}°</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-moonlight-muted">Lng</dt>
            <dd className="text-cyber-cyan">{data.coordinate.lng.toFixed(6)}°</dd>
          </div>
        </dl>
      </div>
    </div>
  );
});
MoonInfo.displayName = 'MoonInfo';
