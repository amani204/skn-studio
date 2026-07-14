export default function CheckoutLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-16 pb-24 pt-32 sm:pt-40">
      {/* Header Skeleton */}
      <header className="mb-10 text-center sm:mb-12">
        <div className="mx-auto h-4 w-24 animate-pulse rounded-full bg-powder/30" />
        <div className="mx-auto mt-2 h-8 w-48 animate-pulse rounded-lg bg-powder/30 sm:h-10" />
        <div className="mx-auto mt-1 h-4 w-40 animate-pulse rounded bg-powder/20" />

        {/* Steps Skeleton */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <div className="h-3 w-16 animate-pulse rounded bg-powder/20" />
          <div className="h-px w-6 bg-powder/10" />
          <div className="h-3 w-16 animate-pulse rounded bg-powder/20" />
          <div className="h-px w-6 bg-powder/10" />
          <div className="h-3 w-16 animate-pulse rounded bg-powder/20" />
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-12">
        {/* Form Skeleton */}
        <div className="space-y-8">
          {/* Contact Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 animate-pulse rounded-full bg-powder/20" />
              <div className="h-6 w-32 animate-pulse rounded bg-powder/20" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-1 h-3 w-24 animate-pulse rounded bg-powder/20" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-powder/10" />
              </div>
              <div>
                <div className="mb-1 h-3 w-24 animate-pulse rounded bg-powder/20" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-powder/10" />
              </div>
            </div>
          </section>

          {/* Delivery Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 animate-pulse rounded-full bg-powder/20" />
              <div className="h-6 w-32 animate-pulse rounded bg-powder/20" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-1 h-3 w-20 animate-pulse rounded bg-powder/20" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-powder/10" />
              </div>
              <div>
                <div className="mb-1 h-3 w-20 animate-pulse rounded bg-powder/20" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-powder/10" />
              </div>
            </div>
            <div>
              <div className="mb-1 h-3 w-20 animate-pulse rounded bg-powder/20" />
              <div className="h-10 w-full animate-pulse rounded-lg bg-powder/10" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="h-24 w-full animate-pulse rounded-lg bg-powder/10" />
              <div className="h-24 w-full animate-pulse rounded-lg bg-powder/10" />
            </div>
          </section>

          {/* Notes Section */}
          <section className="space-y-2">
            <div className="mb-1 h-3 w-20 animate-pulse rounded bg-powder/20" />
            <div className="h-16 w-full animate-pulse rounded-lg bg-powder/10" />
          </section>

          {/* Submit Button Skeleton */}
          <div className="h-12 w-full animate-pulse rounded-lg bg-powder/20" />
        </div>

        {/* Order Summary Skeleton */}
        <div className="rounded-lg border border-powder/30 bg-white/50 p-4">
          <div className="mb-3 h-6 w-40 animate-pulse rounded bg-powder/20" />

          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-10 w-10 animate-pulse rounded-md bg-powder/10" />
                <div className="flex-1">
                  <div className="h-3 w-24 animate-pulse rounded bg-powder/20" />
                  <div className="mt-1 h-2 w-12 animate-pulse rounded bg-powder/10" />
                </div>
                <div className="h-3 w-16 animate-pulse rounded bg-powder/20" />
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-1.5 border-t border-powder/20 pt-3">
            <div className="flex justify-between">
              <div className="h-3 w-20 animate-pulse rounded bg-powder/20" />
              <div className="h-3 w-20 animate-pulse rounded bg-powder/20" />
            </div>
            <div className="flex justify-between">
              <div className="h-3 w-20 animate-pulse rounded bg-powder/20" />
              <div className="h-3 w-20 animate-pulse rounded bg-powder/20" />
            </div>
            <div className="flex justify-between border-t border-powder/20 pt-2">
              <div className="h-4 w-16 animate-pulse rounded bg-powder/20" />
              <div className="h-5 w-24 animate-pulse rounded bg-powder/20" />
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-md bg-powder/10 px-3 py-1.5">
            <div className="h-3 w-3 animate-pulse rounded bg-powder/20" />
            <div className="h-2 w-40 animate-pulse rounded bg-powder/20" />
          </div>
        </div>
      </div>

      
    </div>
  );
}