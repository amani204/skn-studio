// app/products/loading.tsx
export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-8 sm:pt-40">
      {/* Header Skeleton */}
      <div className="mb-10 text-center">
        <div className="mx-auto h-4 w-20 animate-pulse rounded-full bg-powder/10" />
        <div className="mx-auto mt-3 h-10 w-64 animate-pulse rounded-lg bg-powder/10" />
        <div className="mx-auto mt-2 h-4 w-48 animate-pulse rounded-lg bg-powder/10" />
      </div>

      {/* Filters Skeleton */}
<div className="w-full">
  {/* Mobile Filter Toggle Skeleton */}
  <div className="mb-3 flex items-center gap-3 sm:hidden">
    <div className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-powder/30 bg-cream/80 px-4 py-2.5">
      <div className="h-3.5 w-3.5 animate-pulse rounded bg-powder/20" />
      <div className="h-3 w-12 animate-pulse rounded bg-powder/20" />
      <div className="ml-auto h-3.5 w-3.5 animate-pulse rounded bg-powder/20" />
    </div>
  </div>

  {/* Main Filters Bar Skeleton */}
  <div className="w-full overflow-hidden">
    <div className="flex flex-col gap-3 rounded-xl border border-powder/20 bg-cream/80 p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      {/* Categories Skeleton */}
      <div className="flex flex-wrap items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-8 w-14 animate-pulse rounded-lg bg-powder/20 sm:w-16"
          />
        ))}
      </div>

      {/* Price Filters Skeleton */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-lg border border-powder/20 bg-white/50 px-3 py-1.5">
          <span className="h-3 w-4 animate-pulse rounded bg-powder/20" />
          <div className="h-6 w-14 animate-pulse rounded bg-powder/20 sm:w-16" />
        </div>
        <span className="h-3 w-3 animate-pulse rounded bg-powder/20" />
        <div className="flex items-center gap-1 rounded-lg border border-powder/20 bg-white/50 px-3 py-1.5">
          <span className="h-3 w-4 animate-pulse rounded bg-powder/20" />
          <div className="h-6 w-14 animate-pulse rounded bg-powder/20 sm:w-16" />
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Grid Skeleton */}
      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col">
            <div className="aspect-square w-full animate-pulse rounded-lg bg-powder/10" />
            <div className="mt-3 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-powder/10" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-powder/20" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-powder/20" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}