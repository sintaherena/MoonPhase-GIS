'use client';

export interface TimelineProps {
  moonrise: Date | null;
  moonset: Date | null;
  now: Date;
}

/**
 * Format a Date to "HH:mm" in WIB (UTC+7).
 */
function formatTimeShort(date: Date): string {
  const wibTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  const hours = String(wibTime.getUTCHours()).padStart(2, '0');
  const minutes = String(wibTime.getUTCMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Convert a Date to a 0-1 progress value within a 24-hour day (WIB).
 */
function dateToProgress(date: Date): number {
  const wibTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  const hours = wibTime.getUTCHours();
  const minutes = wibTime.getUTCMinutes();
  return (hours * 60 + minutes) / (24 * 60);
}

/**
 * Timeline - Linear timeline showing moonrise, transit, and moonset.
 */
export function Timeline({ moonrise, moonset, now }: TimelineProps) {
  // Calculate current time progress
  const nowProgress = dateToProgress(now);

  // Calculate moonrise and moonset progress
  const riseProgress = moonrise ? dateToProgress(moonrise) : null;
  const setProgress = moonset ? dateToProgress(moonset) : null;

  // Calculate transit (highest point) - midpoint between rise and set
  // If we have both rise and set, calculate midpoint
  // Otherwise estimate based on available data
  let transitProgress: number | null = null;
  if (riseProgress !== null && setProgress !== null) {
    if (setProgress > riseProgress) {
      transitProgress = (riseProgress + setProgress) / 2;
    } else {
      // Moonset is next day (before moonrise in the day)
      transitProgress = ((riseProgress + (setProgress + 1)) / 2) % 1;
    }
  }

  // Determine if moon is currently up
  const isMoonUp = (() => {
    if (riseProgress === null || setProgress === null) return false;
    if (riseProgress < setProgress) {
      return nowProgress >= riseProgress && nowProgress <= setProgress;
    }
    // Wraps around midnight
    return nowProgress >= riseProgress || nowProgress <= setProgress;
  })();

  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-sans text-sm font-medium text-moonlight-muted">
          Linimasa Bulan
        </span>
        {isMoonUp && (
          <span className="rounded-full bg-cyber-cyan/10 px-2 py-0.5 font-mono text-xs text-cyber-cyan">
            Terlihat
          </span>
        )}
      </div>

      {/* Timeline bar */}
      <div className="relative">
        {/* Time markers (every 6 hours) */}
        <div className="flex justify-between px-0.5 pb-1">
          <span className="font-mono text-[10px] text-moonlight-muted/50">00</span>
          <span className="font-mono text-[10px] text-moonlight-muted/50">06</span>
          <span className="font-mono text-[10px] text-moonlight-muted/50">12</span>
          <span className="font-mono text-[10px] text-moonlight-muted/50">18</span>
          <span className="font-mono text-[10px] text-moonlight-muted/50">24</span>
        </div>

        {/* Bar */}
        <div className="relative h-10 rounded-lg bg-space-elevated">
          {/* Progress fill */}
          <div
            className="absolute left-0 top-0 h-full rounded-lg bg-white/5"
            style={{ width: `${nowProgress * 100}%` }}
          />

          {/* Current time indicator */}
          <div
            className="absolute top-0 h-full w-0.5 bg-white/30"
            style={{ left: `${nowProgress * 100}%` }}
          >
            <div className="absolute -left-1 -top-1 h-2.5 w-2.5 rounded-full bg-white/50" />
          </div>

          {/* Moonrise marker */}
          {riseProgress !== null && (
            <div
              className="absolute top-0 flex h-full flex-col items-center"
              style={{ left: `${riseProgress * 100}%` }}
            >
              {/* Marker */}
              <div className="flex h-full items-start pt-1">
                <div className="relative">
                  <svg width="16" height="12" viewBox="0 0 16 12" className="text-cyber-cyan">
                    <path
                      d="M8 0L14 8H2L8 0Z"
                      fill="currentColor"
                      className="drop-shadow-[0_0_4px_rgba(34,211,238,0.5)]"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Transit marker */}
          {transitProgress !== null && (
            <div
              className="absolute top-0 flex h-full flex-col items-center"
              style={{ left: `${transitProgress * 100}%` }}
            >
              <div className="flex h-full items-center">
                <div className="h-2 w-2 rounded-full bg-cyber-cyan shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
              </div>
            </div>
          )}

          {/* Moonset marker */}
          {setProgress !== null && (
            <div
              className="absolute top-0 flex h-full flex-col items-center"
              style={{ left: `${setProgress * 100}%` }}
            >
              <div className="flex h-full items-end pb-1">
                <div className="relative">
                  <svg width="16" height="12" viewBox="0 0 16 12" className="text-cyber-cyan">
                    <path
                      d="M8 12L2 4H14L8 12Z"
                      fill="currentColor"
                      className="drop-shadow-[0_0_4px_rgba(34,211,238,0.5)]"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Time labels */}
        <div className="relative mt-1 flex justify-between">
          {/* Rise label */}
          {moonrise && riseProgress !== null && (
            <div
              className="absolute flex flex-col items-center"
              style={{
                left: `${riseProgress * 100}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <span className="font-mono text-[10px] text-cyber-cyan">
                ↑ {formatTimeShort(moonrise)}
              </span>
            </div>
          )}

          {/* Transit label */}
          {transitProgress !== null && (
            <div
              className="absolute flex flex-col items-center"
              style={{
                left: `${transitProgress * 100}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <span className="font-mono text-[10px] text-cyber-cyan/70">
                ↑ puncak
              </span>
            </div>
          )}

          {/* Set label */}
          {moonset && setProgress !== null && (
            <div
              className="absolute flex flex-col items-center"
              style={{
                left: `${setProgress * 100}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <span className="font-mono text-[10px] text-cyber-cyan">
                ↓ {formatTimeShort(moonset)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
