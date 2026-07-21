// path: components/admin/products/NewProductButton.tsx
"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

export function NewProductButton() {
  return (
    <Link
      href="/admin/products/new"
      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg bg-navy text-sm font-medium text-white transition-all hover:bg-navy/80 hover:shadow-md"
    >
      <Plus className="w-4 h-4" />
      <span>Nouveau Produit</span>
    </Link>
  );
}