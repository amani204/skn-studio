"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

type Category = { id: string; name: string; slug: string };

export function Filters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={searchParams.get("category") ?? ""}
        onChange={(e) => updateParam("category", e.target.value)}
        className="rounded-md border border-brand-border bg-brand-surface px-3 py-2 text-sm text-brand-text focus:border-brand-primary focus:outline-none"
      >
        <option value="">All categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Min price"
        defaultValue={searchParams.get("minPrice") ?? ""}
        onBlur={(e) => updateParam("minPrice", e.target.value)}
        className="w-28 rounded-md border border-brand-border bg-brand-surface px-3 py-2 text-sm text-brand-text focus:border-brand-primary focus:outline-none"
      />

      <input
        type="number"
        placeholder="Max price"
        defaultValue={searchParams.get("maxPrice") ?? ""}
        onBlur={(e) => updateParam("maxPrice", e.target.value)}
        className="w-28 rounded-md border border-brand-border bg-brand-surface px-3 py-2 text-sm text-brand-text focus:border-brand-primary focus:outline-none"
      />

      <select
        value={searchParams.get("sort") ?? "newest"}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="rounded-md border border-brand-border bg-brand-surface px-3 py-2 text-sm text-brand-text focus:border-brand-primary focus:outline-none"
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  );
}