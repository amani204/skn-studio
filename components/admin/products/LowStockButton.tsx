"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

interface LowStockButtonProps {
  count?: number;
}

export function LowStockButton({ count }: LowStockButtonProps) {
  return (
    <Link
      href="/admin/products/low-stock"
      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/60 font-medium text-sm hover:bg-amber-100/80 active:scale-[0.98] transition-all duration-150"
    >
      <AlertTriangle className="w-4 h-4 text-amber-600" />
      <span>Stock Bas</span>
      {count !== undefined && (
        <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold bg-amber-200/80 text-amber-900 rounded-md">
          {count}
        </span>
      )}
    </Link>
  );
}