import "server-only";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

// Orders that represent real (or likely-to-complete) revenue.
// Cancelled orders are excluded everywhere revenue is calculated.
const REVENUE_STATUSES: OrderStatus[] = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];
const ACTIVE_STATUSES: OrderStatus[] = ["PENDING", "PROCESSING", "SHIPPED"];

export type DashboardStats = {
  totalRevenue: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  /** null when last month had zero revenue - a percentage change is meaningless there */
  revenueChangePercent: number | null;
  activeOrders: number;
  pendingOrders: number;
  totalProducts: number;
};

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const lastMonthStart = new Date(thisMonthStart);
  lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

  const [revenueOrders, activeOrders, pendingOrders, totalProducts] = await Promise.all([
    prisma.order.findMany({
      where: { status: { in: REVENUE_STATUSES } },
      select: { total: true, createdAt: true },
    }),
    prisma.order.count({ where: { status: { in: ACTIVE_STATUSES } } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.product.count(),
  ]);

  let totalRevenue = 0;
  let revenueThisMonth = 0;
  let revenueLastMonth = 0;

  for (const order of revenueOrders) {
    const amount = Number(order.total);
    totalRevenue += amount;

    if (order.createdAt >= thisMonthStart) {
      revenueThisMonth += amount;
    } else if (order.createdAt >= lastMonthStart && order.createdAt < thisMonthStart) {
      revenueLastMonth += amount;
    }
  }

  const revenueChangePercent =
    revenueLastMonth > 0
      ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100
      : revenueThisMonth > 0
      ? 100
      : null;

  return {
    totalRevenue,
    revenueThisMonth,
    revenueLastMonth,
    revenueChangePercent,
    activeOrders,
    pendingOrders,
    totalProducts,
  };
}

export type MonthlyRevenue = { month: string; revenue: number };

export async function getMonthlyRevenue(monthsBack = 6): Promise<MonthlyRevenue[]> {
  const now = new Date();
  const rangeStart = new Date(now.getFullYear(), now.getMonth() - (monthsBack - 1), 1);

  const orders = await prisma.order.findMany({
    where: {
      status: { in: REVENUE_STATUSES },
      createdAt: { gte: rangeStart },
    },
    select: { total: true, createdAt: true },
  });

  // Pre-fill every month in range, even ones with zero revenue,
  // so the chart doesn't silently skip a quiet month.
  const buckets: MonthlyRevenue[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const bucketDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      month: bucketDate.toLocaleDateString("fr-FR", { month: "short" }),
      revenue: 0,
    });
  }

  for (const order of orders) {
    const monthsAgo =
      (now.getFullYear() - order.createdAt.getFullYear()) * 12 +
      (now.getMonth() - order.createdAt.getMonth());
    const bucketIndex = monthsBack - 1 - monthsAgo;
    if (bucketIndex >= 0 && bucketIndex < buckets.length) {
      buckets[bucketIndex].revenue += Number(order.total);
    }
  }

  return buckets;
}

export type OrdersByStatus = { status: OrderStatus; label: string; count: number };

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "En attente",
  PROCESSING: "En traitement",
  SHIPPED: "Expédié",
  DELIVERED: "Livré",
  CANCELLED: "Annulé",
};

export async function getOrdersByStatus(): Promise<OrdersByStatus[]> {
  const statuses: OrderStatus[] = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  const counts = await Promise.all(
    statuses.map((status) => prisma.order.count({ where: { status } }))
  );

  return statuses.map((status, i) => ({
    status,
    label: STATUS_LABELS[status],
    count: counts[i],
  }));
}