/**
 * SkeletonSidebar - Loading skeleton with shimmer animation.
 * Matches the dimensions of the MoonInfo panel to prevent layout shift.
 */
export function SkeletonSidebar() {
  return (
    <div className="flex flex-col gap-4">
      {/* Phase name skeleton */}
      <div className="h-7 w-40 animate-shimmer rounded-lg" />

      {/* Visualizer skeleton */}
      <div className="flex justify-center py-4">
        <div className="h-[180px] w-[180px] animate-shimmer rounded-full" />
      </div>

      {/* Illumination arc skeleton */}
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 animate-shimmer rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-24 animate-shimmer rounded" />
          <div className="h-3 w-16 animate-shimmer rounded" />
        </div>
      </div>

      {/* Data rows skeleton */}
      <div className="space-y-3 pt-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between">
            <div className="h-3 w-20 animate-shimmer rounded" />
            <div className="h-3 w-16 animate-shimmer rounded" />
          </div>
        ))}
      </div>

      {/* Timeline skeleton */}
      <div className="pt-4">
        <div className="h-3 w-32 animate-shimmer rounded mb-3" />
        <div className="h-10 w-full animate-shimmer rounded-lg" />
      </div>
    </div>
  );
}
