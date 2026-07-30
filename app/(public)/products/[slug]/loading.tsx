export default function ProductDetailLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-8 sm:pt-40">
      {/* Product Section */}
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        {/* Image Skeleton */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-powder/20 animate-pulse" />
        </div>

        {/* Details Skeleton */}
        <div className="flex flex-col space-y-4">
          {/* Category */}
          <div className="h-3 w-20 animate-pulse rounded bg-powder/30" />
          
          {/* Name */}
          <div className="h-8 w-3/4 animate-pulse rounded-lg bg-powder/30 sm:h-10" />
          
          {/* Price */}
          <div className="flex items-baseline gap-3">
            <div className="h-8 w-32 animate-pulse rounded bg-powder/30" />
            <div className="h-6 w-24 animate-pulse rounded bg-powder/20" />
          </div>
          
          {/* Stock */}
          <div className="h-4 w-20 animate-pulse rounded bg-powder/30" />
          
          {/* Description */}
          <div className="mt-6 space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-powder/20" />
            <div className="h-4 w-full animate-pulse rounded bg-powder/20" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-powder/20" />
          </div>
        
<div className="mt-6 space-y-4">
  {/* Add to Cart Button Skeleton */}
  <div className="h-12 w-full animate-pulse rounded-xl bg-powder/30" />
</div>
          
          {/* Highlights */}
          <div className="mt-8 grid grid-cols-3 gap-2 border-t border-powder/30 pt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1 text-center">
                <div className="h-5 w-5 animate-pulse rounded-full bg-powder/20" />
                <div className="h-3 w-16 animate-pulse rounded bg-powder/20" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Skeleton */}
      <div className="mt-20 border-t border-powder/30 pt-16">
        <div className="text-center">
          <div className="mx-auto h-4 w-16 animate-pulse rounded bg-powder/30" />
          <div className="mx-auto mt-3 h-8 w-48 animate-pulse rounded-lg bg-powder/30 sm:h-10" />
        </div>
        
        <div className="mt-12 rounded-2xl border border-powder/30 bg-white/30 p-6 sm:p-8">
          <div className="text-center">
            <div className="mx-auto h-4 w-48 animate-pulse rounded bg-powder/30" />
            <div className="mx-auto mt-1 h-3 w-64 animate-pulse rounded bg-powder/20" />
          </div>
          <div className="mx-auto mt-6 max-w-lg space-y-5">
            <div>
              <div className="mx-auto h-4 w-24 animate-pulse rounded bg-powder/30" />
              <div className="mt-2 flex justify-center gap-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-8 w-8 animate-pulse rounded bg-powder/20" />
                ))}
              </div>
            </div>
            <div>
              <div className="h-4 w-16 animate-pulse rounded bg-powder/30" />
              <div className="mt-1 h-10 w-full animate-pulse rounded-lg bg-powder/20" />
            </div>
            <div>
              <div className="h-4 w-24 animate-pulse rounded bg-powder/30" />
              <div className="mt-1 h-24 w-full animate-pulse rounded-lg bg-powder/20" />
            </div>
            <div className="h-12 w-full animate-pulse rounded-lg bg-powder/30" />
          </div>
        </div>
        
        <div className="mt-8 space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-powder/30 bg-white/30 p-6 animate-pulse">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-powder/20" />
                  <div>
                    <div className="h-4 w-24 rounded bg-powder/20" />
                    <div className="mt-1 flex gap-1">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <div key={j} className="h-4 w-4 rounded bg-powder/20" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="h-3 w-20 rounded bg-powder/20" />
              </div>
              <div className="mt-3 space-y-2">
                <div className="h-3 w-full rounded bg-powder/20" />
                <div className="h-3 w-3/4 rounded bg-powder/20" />
              </div>
            </div>
          ))}
        </div>

        
      </div>

      {/* You May Also Like Skeleton */}
      <div className="mt-20 border-t border-powder/30 pt-16">
        <div className="mb-10 text-center">
          <div className="mx-auto h-4 w-40 animate-pulse rounded bg-powder/30" />
          <div className="mx-auto mt-3 h-8 w-56 animate-pulse rounded-lg bg-powder/30 sm:h-10" />
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col">
              <div className="aspect-square w-full animate-pulse rounded-lg bg-powder/30" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-powder/20" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-powder/20" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-powder/20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}