import "server-only";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import type { OrderStatus } from "@prisma/client";

// ==================== SERIALIZATION ====================
// Prisma's Decimal fields are class instances, not plain objects. Next.js
// refuses to pass them from a Server Component into a Client Component
// ("Only plain objects can be passed..."). We convert every Decimal to a
// plain `number` here, once, so every caller of these functions already
// gets client-safe data — no need to re-serialize in every page.

type RawOrder = NonNullable<Awaited<ReturnType<typeof fetchOrderById>>>;

function serializeOrder(order: RawOrder) {
  return {
    ...order,
    subtotal: Number(order.subtotal),
    shippingCost: Number(order.shippingCost),
    total: Number(order.total),
    items: order.items.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
  };
}

export type OrderWithDetails = ReturnType<typeof serializeOrder>;

// ==================== QUERIES ====================

const orderInclude = {
  items: {
    include: {
      product: {
        select: {
          id: true,
          slug: true,
          images: { take: 1, orderBy: { order: "asc" as const } },
        },
      },
    },
  },
  shippingAddress: true,
} as const;

async function fetchOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: orderInclude,
  });
}

/**
 * Fetches all orders with everything the dashboard table/detail view needs:
 * line items (with the product's current image, in case the product still
 * exists) and the shipping address. Decimal fields are pre-serialized.
 */
export async function getAllOrders(): Promise<OrderWithDetails[]> {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: orderInclude,
    });
    return orders.map(serializeOrder);
  } catch (error) {
    console.error("Database error in getAllOrders:", error);
    throw new Error("Impossible de récupérer les commandes.");
  }
}

/**
 * Fetches a single order by id, pre-serialized for direct use in Client
 * Components (e.g. passed straight into <StatusSelect />).
 */
export async function getOrderById(id: string): Promise<OrderWithDetails | null> {
  try {
    const order = await fetchOrderById(id);
    return order ? serializeOrder(order) : null;
  } catch (error) {
    console.error(`Database error in getOrderById for ID ${id}:`, error);
    throw new Error("Impossible de récupérer la commande.");
  }
}

/**
 * Updates only the status of an order. Orders are never hard-deleted —
 * CANCELLED is the terminal "removed" state, which keeps revenue reports,
 * order history, and customer-support lookups intact.
 */
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<OrderWithDetails> {
  const existing = await prisma.order.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    throw new AppError("Commande introuvable.", 404, "ORDER_NOT_FOUND");
  }

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: orderInclude,
    });
    return serializeOrder(order);
  } catch (error: any) {
    if (error?.code === "P2025") {
      throw new AppError("Commande introuvable.", 404, "ORDER_NOT_FOUND");
    }
    console.error(`Database error in updateOrderStatus for ID ${id}:`, error);
    throw new AppError("Impossible de mettre à jour la commande.", 500);
  }
}