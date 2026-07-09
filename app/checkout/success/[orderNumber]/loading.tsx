export default function OrderSuccessLoading() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-24 pt-32 text-center sm:px-8 sm:pt-40">
      {/* Checkmark Icon Skeleton */}
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-powder/30 animate-pulse">
        <div className="h-8 w-8 rounded-full bg-powder/20" />
      </div>

      {/* Title Skeleton */}
      <div className="mx-auto h-8 w-64 animate-pulse rounded-lg bg-powder/20 sm:h-10" />
      
      {/* Order Number Skeleton */}
      <div className="mx-auto mt-2 h-4 w-48 animate-pulse rounded bg-powder/20" />

      {/* Order Summary Skeleton */}
      <div className="mt-8 rounded-lg border border-powder/40 bg-white/50 p-6">
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-32 animate-pulse rounded bg-powder/20" />
              <div className="h-4 w-20 animate-pulse rounded bg-powder/20" />
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2 border-t border-powder/20 pt-4">
          <div className="flex justify-between">
            <div className="h-4 w-24 animate-pulse rounded bg-powder/20" />
            <div className="h-4 w-20 animate-pulse rounded bg-powder/20" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-24 animate-pulse rounded bg-powder/20" />
            <div className="h-4 w-20 animate-pulse rounded bg-powder/20" />
          </div>
          <div className="flex justify-between border-t border-powder/20 pt-2">
            <div className="h-5 w-16 animate-pulse rounded bg-powder/20" />
            <div className="h-6 w-24 animate-pulse rounded bg-powder/20" />
          </div>
        </div>
      </div>

      {/* Description Skeleton */}
      <div className="mx-auto mt-6 h-4 w-80 animate-pulse rounded bg-powder/20" />

      {/* Buttons Skeleton */}
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <div className="h-12 w-48 animate-pulse rounded-lg bg-powder/20" />
        <div className="h-4 w-32 animate-pulse rounded bg-powder/20" />
      </div>
    </main>
  );
}