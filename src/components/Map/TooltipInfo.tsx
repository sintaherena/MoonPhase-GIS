'use client';

interface TooltipInfoProps {
  coordinate: { lat: number; lng: number } | null;
  isVisible: boolean;
  position?: { x: number; y: number } | null;
}

export function TooltipInfo({ coordinate, isVisible, position }: TooltipInfoProps) {
  if (!isVisible || !coordinate || !position) return null;

  return (
    <div
      className="pointer-events-none z-[1000] rounded-lg bg-space-elevated/95 px-3 py-2 font-mono text-xs text-moonlight-muted backdrop-blur-sm transition-opacity duration-200"
      style={{
        position: 'absolute',
        left: position.x + 15,
        top: position.y - 10,
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div className="flex flex-col gap-1">
        <span className="text-cyber-cyan">
          Lat: {coordinate.lat.toFixed(4)}°
        </span>
        <span className="text-cyber-cyan">
          Lng: {coordinate.lng.toFixed(4)}°
        </span>
      </div>
    </div>
  );
}
