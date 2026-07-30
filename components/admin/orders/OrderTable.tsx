"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Eye, PackageOpen } from "lucide-react";
import { StatusSelect } from "./StatusSelect";
import { orderStatusOptions, type OrderStatusValue } from "@/lib/order-status";
import type { OrderWithDetails } from "@/lib/admin/order";

interface OrderTableProps {
  orders: OrderWithDetails[];
}

const DZD = new Intl.NumberFormat("fr-DZ", { maximumFractionDigits: 0 });

export function OrderTable({ orders: initialOrders }: OrderTableProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatusValue | "ALL">("ALL");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((order) => {
      if (statusFilter !== "ALL" && order.status !== statusFilter) return false;
      if (!q) return true;
      const haystack = [
        order.orderNumber,
        order.shippingAddress?.fullName,
        order.shippingAddress?.phone,
        order.shippingAddress?.wilaya,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [orders, search, statusFilter]);

  const handleStatusUpdated = (orderId: string, newStatus: OrderStatusValue) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher client, téléphone, commande..."
            className="w-full rounded-lg border border-powder/40 bg-white py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink/40 focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/10"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatusValue | "ALL")}
          className="w-full rounded-lg border border-powder/40 bg-white px-3 py-2 text-sm text-ink focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/10 sm:w-56"
        >
          <option value="ALL">Tous les statuts</option>
          {orderStatusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-powder/30 bg-white">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-ink/40">
            <PackageOpen size={32} strokeWidth={1.5} />
            <p className="text-sm">Aucune commande ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-powder/30 bg-powder/5 text-xs uppercase tracking-wide text-ink/50">
                  <th className="px-4 py-3 font-medium">Commande</th>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Wilaya</th>
                  <th className="px-4 py-3 font-medium">Articles</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium text-right">Voir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-powder/20">
                {filtered.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-powder/5">
                    <td className="px-4 py-3 font-medium text-navy">
                      #{order.orderNumber.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{order.shippingAddress?.fullName ?? "—"}</p>
                      <p className="text-xs text-ink/50">{order.shippingAddress?.phone ?? "—"}</p>
                    </td>
                    <td className="px-4 py-3 text-ink/70">{order.shippingAddress?.wilaya ?? "—"}</td>
                    <td className="px-4 py-3 text-ink/70">{order.items.length}</td>
                    <td className="px-4 py-3 font-medium text-ink">
                      {DZD.format(Number(order.total))} DA
                    </td>
                    <td className="px-4 py-3">
                      <StatusSelect
                        orderId={order.id}
                        status={order.status as OrderStatusValue}
                        onUpdated={(newStatus) => handleStatusUpdated(order.id, newStatus)}
                      />
                    </td>
                    <td className="px-4 py-3 text-ink/50">
                      {new Date(order.createdAt).toLocaleDateString("fr-DZ", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-navy hover:bg-navy/5"
                      >
                        <Eye size={14} strokeWidth={1.5} />
                        Détails
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}