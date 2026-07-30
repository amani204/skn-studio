import { z } from "zod";

// Mirrors the `OrderStatus` enum in schema.prisma.
// Kept as an explicit list (not imported from @prisma/client) so this file
// has zero risk of pulling Prisma's client into a client bundle by mistake.
export const orderStatusValues = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export const updateOrderStatusSchema = z.object({
  status: z.enum(orderStatusValues, {
     message: "Statut de commande invalide.",
  }),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;