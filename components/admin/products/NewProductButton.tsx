// path: components/admin/products/NewProductButton.tsx
"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

export function NewProductButton() {
  return (
    <Link
      href="/admin/products/new"
      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 active:scale-[0.98] transition-all duration-150 shadow-sm"
    >
      <Plus className="w-4 h-4" />
      <span>Nouveau Produit</span>
    </Link>
  );
}