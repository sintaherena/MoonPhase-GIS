'use client';

import type { MoonPhaseName } from '@/types';

export interface VisualizerProps {
  phase: MoonPhaseName;
  illumination: number;
  size?: number;
}

/**
 * Get the phase angle (0-1) from the phase name for shadow calculations.
 */
function getPhaseAngle(phase: MoonPhaseName): number {
  const phaseMap: Record<MoonPhaseName, number> = {
    new_moon: 0,
    waxing_crescent: 0.125,
    first_quarter: 0.25,
    waxing_gibbous: 0.375,
    full_moon: 0.5,
    waning_gibbous: 0.625,
    last_quarter: 0.75,
    waning_crescent: 0.875,
  };
  return phaseMap[phase];
}

/**
 * Visualizer - SVG moon visualization with dynamic shadow based on phase.
 */
export function Visualizer({ phase, illumination, size = 180 }: VisualizerProps) {
  const center = size / 2;
  const radius = size / 2 - 4; // Small padding for glow
  const phaseAngle = getPhaseAngle(phase);

  // Determine if waxing (phase angle < 0.5) or waning
  const isWaxing = phaseAngle < 0.5 || phaseAngle >= 1;

  // Calculate shadow arc
  const illuminationFraction = Math.min(Math.max(illumination, 0), 1);

  // The shadow covers (1 - illumination) of the moon
  // For new moon (0% lit), shadow covers everything
  // For full moon (100% lit), no shadow
  const shadowFraction = 1 - illuminationFraction;

  // Build SVG path for the shadow
  // We'll use a more sophisticated approach with bezier curves
  const buildShadowPath = () => {
    if (shadowFraction <= 0.01) return '';
    if (shadowFraction >= 0.99) return `M ${center} ${center - radius} A ${radius} ${radius} 0 1 1 ${center} ${center + radius} A ${radius} ${radius} 0 1 1 ${center} ${center - radius}`;

    // Calculate the terminator ellipse
    // The terminator width determines how curved the shadow edge is
    const terminatorX = radius * (1 - 2 * illuminationFraction);

    // Start from top of moon circle
    const startX = center;
    const startY = center - radius;

    // End at bottom of moon circle
    const endY = center + radius;

    // Shadow path: from top, arc along one side, terminator curve, arc back
    // For waxing: shadow on left, for waning: shadow on right
    if (isWaxing) {
      // Shadow on the right side
      return [
        `M ${startX} ${startY}`,
        `A ${radius} ${radius} 0 0 0 ${startX} ${endY}`, // Left arc (clockwise through left)
        `A ${Math.abs(terminatorX)} ${radius} 0 0 ${terminatorX > 0 ? 1 : 0} ${startX} ${startY}`, // Terminator curve
        'Z'
      ].join(' ');
    } else {
      // Shadow on the left side
      return [
        `M ${startX} ${startY}`,
        `A ${radius} ${radius} 0 0 1 ${startX} ${endY}`, // Right arc (clockwise through right)
        `A ${Math.abs(terminatorX)} ${radius} 0 0 ${terminatorX > 0 ? 0 : 1} ${startX} ${startY}`, // Terminator curve
        'Z'
      ].join(' ');
    }
  };

  const shadowPath = buildShadowPath();

  // Glow intensity based on illumination
  const glowIntensity = Math.round(illuminationFraction * 20);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Glow effect */}
      <div
        className="absolute rounded-full transition-all duration-500"
        style={{
          width: size + glowIntensity * 2,
          height: size + glowIntensity * 2,
          background: `radial-gradient(circle, rgba(232, 236, 244, ${0.1 + illuminationFraction * 0.15}) 0%, transparent 70%)`,
          filter: `blur(${glowIntensity}px)`,
        }}
      />

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="relative z-10"
      >
        <defs>
          {/* Moon surface gradient */}
          <radialGradient id="moonSurface" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#F0F4FF" />
            <stop offset="50%" stopColor="#E8ECF4" />
            <stop offset="100%" stopColor="#C8D0E0" />
          </radialGradient>

          {/* Clip path for moon circle */}
          <clipPath id="moonClip">
            <circle cx={center} cy={center} r={radius} />
          </clipPath>

          {/* Shadow gradient */}
          <radialGradient id="shadowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0B0E14" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#12161F" stopOpacity="0.9" />
          </radialGradient>
        </defs>

        {/* Moon base circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="url(#moonSurface)"
          className="transition-all duration-500"
        />

        {/* Surface texture dots */}
        <g clipPath="url(#moonClip)" opacity="0.15">
          <circle cx={center - 15} cy={center - 20} r={8} fill="#B8C4D8" />
          <circle cx={center + 20} cy={center + 10} r={12} fill="#B8C4D8" />
          <circle cx={center - 5} cy={center + 25} r={6} fill="#B8C4D8" />
          <circle cx={center + 10} cy={center - 30} r={5} fill="#B8C4D8" />
          <circle cx={center - 25} cy={center + 5} r={7} fill="#B8C4D8" />
        </g>

        {/* Shadow overlay */}
        {shadowPath && (
          <path
            d={shadowPath}
            fill="#0B0E14"
            clipPath="url(#moonClip)"
            className="transition-all duration-500 ease-out"
            style={{ opacity: 0.92 }}
          />
        )}

        {/* Subtle rim light */}
        <circle
          cx={center}
          cy={center}
          r={radius - 1}
          fill="none"
          stroke="rgba(232, 236, 244, 0.2)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
