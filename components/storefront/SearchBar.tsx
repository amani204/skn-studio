"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products..."
        className="w-full rounded-full border border-brand-border bg-brand-surface px-4 py-2 text-sm text-brand-text placeholder:text-brand-text-muted focus:border-brand-primary focus:outline-none"
      />
      <button
        type="submit"
        className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-brand-primary px-3 py-1 text-xs font-medium text-white transition hover:bg-brand-primary-dark disabled:opacity-60"
        disabled={isPending}
      >
        {isPending ? "..." : "Search"}
      </button>
    </form>
  );
}