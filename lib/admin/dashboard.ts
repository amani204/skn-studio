import "server-only";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

// Revenue only counts money actually collected. PENDING/PROCESSING/SHIPPED
// orders can still be CANCELLED, so counting them here would overstate
// revenue — a COD order isn't "revenue" until it's DELIVERED.
const REVENUE_STATUSES: OrderStatus[] = ["DELIVERED"];
const ACTIVE_STATUSES: OrderStatus[] = ["PENDING", "PROCESSING", "SHIPPED"];

export type DashboardStats = {
  totalRevenue: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  revenueChangePercent: number | null;
  activeOrders: number;
  pendingOrders: number;
  totalProducts: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  
  // Set explicit midnight boundaries to prevent floating timestamp bugs
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Let the database handle the calculation aggregation logic
  const [
    totalRevenueAgg,
    thisMonthRevenueAgg,
    lastMonthRevenueAgg,
    activeOrders,
    pendingOrders,
    totalProducts
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { status: { in: REVENUE_STATUSES } },
      _sum: { total: true }
    }),
    prisma.order.aggregate({
      where: { 
        status: { in: REVENUE_STATUSES },
        createdAt: { gte: thisMonthStart }
      },
      _sum: { total: true }
    }),
    prisma.order.aggregate({
      where: { 
        status: { in: REVENUE_STATUSES },
        createdAt: { gte: lastMonthStart, lt: thisMonthStart }
      },
      _sum: { total: true }
    }),
    prisma.order.count({ where: { status: { in: ACTIVE_STATUSES } } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.product.count(),
  ]);

  const totalRevenue = Number(totalRevenueAgg._sum.total) || 0;
  const revenueThisMonth = Number(thisMonthRevenueAgg._sum.total) || 0;
  const revenueLastMonth = Number(lastMonthRevenueAgg._sum.total) || 0;

  const revenueChangePercent =
    revenueLastMonth > 0
      ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100
      : revenueLastMonth === 0 && revenueThisMonth > 0
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

  const buckets: MonthlyRevenue[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const bucketDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      month: bucketDate.toLocaleDateString("fr-FR", { month: "short" }).replace(".", ""),
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
  // Uses a single optimized database group-by scan query instead of multiple counts loop
  const groupings = await prisma.order.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  const countsMap = new Map(groupings.map(g => [g.status, g._count._all]));
  const orderOrder: OrderStatus[] = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  return orderOrder.map((status) => ({
    status,
    label: STATUS_LABELS[status],
    count: countsMap.get(status) || 0,
  }));
}