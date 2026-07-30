import "server-only";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import type { OrderStatus } from "@prisma/client";

export type OrderWithDetails = NonNullable<Awaited<ReturnType<typeof getOrderById>>>;

/**
 * Fetches all orders with everything the dashboard table/detail view needs:
 * line items (with the product's current image, in case the product still
 * exists) and the shipping address.
 */
export async function getAllOrders() {
  try {
    return await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                slug: true,
                images: { take: 1, orderBy: { order: "asc" } },
              },
            },
          },
        },
        shippingAddress: true,
      },
    });
  } catch (error) {
    console.error("Database error in getAllOrders:", error);
    throw new Error("Impossible de récupérer les commandes.");
  }
}

/**
 * Fetches a single order by id — used to check existence before updating
 * and to return the fresh, fully-populated order after the update.
 */
export async function getOrderById(id: string) {
  try {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                slug: true,
                images: { take: 1, orderBy: { order: "asc" } },
              },
            },
          },
        },
        shippingAddress: true,
      },
    });
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
export async function updateOrderStatus(id: string, status: OrderStatus) {
  const existing = await prisma.order.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    throw new AppError("Commande introuvable.", 404, "ORDER_NOT_FOUND");
  }

  try {
    return await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                slug: true,
                images: { take: 1, orderBy: { order: "asc" } },
              },
            },
          },
        },
        shippingAddress: true,
      },
    });
  } catch (error: any) {
    if (error?.code === "P2025") {
      throw new AppError("Commande introuvable.", 404, "ORDER_NOT_FOUND");
    }
    console.error(`Database error in updateOrderStatus for ID ${id}:`, error);
    throw new AppError("Impossible de mettre à jour la commande.", 500);
  }
}