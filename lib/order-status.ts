import { orderStatusValues } from "@/lib/validation/order";

export type OrderStatusValue = (typeof orderStatusValues)[number];

export const orderStatusConfig: Record<
  OrderStatusValue,
  { label: string; badgeClass: string; dotClass: string }
> = {
  PENDING: {
    label: "En attente",
    badgeClass: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    dotClass: "bg-amber-500",
  },
  PROCESSING: {
    label: "En préparation",
    badgeClass: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    dotClass: "bg-blue-500",
  },
  SHIPPED: {
    label: "Expédiée",
    badgeClass: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
    dotClass: "bg-purple-500",
  },
  DELIVERED: {
    label: "Livrée",
    badgeClass: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dotClass: "bg-emerald-500",
  },
  CANCELLED: {
    label: "Annulée",
    badgeClass: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    dotClass: "bg-rose-500",
  },
};

export const orderStatusOptions = orderStatusValues.map((value) => ({
  value,
  label: orderStatusConfig[value].label,
}));