export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 h-8 w-40 animate-pulse rounded bg-brand-border" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square rounded-lg bg-brand-border" />
            <div className="mt-2 h-4 w-3/4 rounded bg-brand-border" />
          </div>
        ))}
      </div>
    </div>
  );
}