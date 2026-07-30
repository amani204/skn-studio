"use client";

import { useState } from "react";
import { orderStatusOptions, orderStatusConfig, type OrderStatusValue } from "@/lib/order-status";

interface StatusSelectProps {
  orderId: string;
  status: OrderStatusValue;
  onUpdated?: (newStatus: OrderStatusValue) => void;
  className?: string;
}

export function StatusSelect({ orderId, status, onUpdated, className }: StatusSelectProps) {
  const [current, setCurrent] = useState<OrderStatusValue>(status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const config = orderStatusConfig[current];

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatusValue;
    const previous = current;

    setCurrent(newStatus); // optimistic UI
    setError(null);
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Échec de la mise à jour.");
      }

      onUpdated?.(newStatus);
    } catch (err) {
      setCurrent(previous); // rollback on failure
      setError(err instanceof Error ? err.message : "Échec de la mise à jour.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={className}>
      <select
        value={current}
        onChange={handleChange}
        disabled={isUpdating}
        aria-label="Statut de la commande"
        className={`cursor-pointer rounded-full border-0 py-1 pl-3 pr-7 text-xs font-medium outline-none transition-opacity focus:ring-2 focus:ring-navy/30 disabled:cursor-wait disabled:opacity-60 ${config.badgeClass}`}
      >
        {orderStatusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-[11px] text-rose-500">{error}</p>}
    </div>
  );
}