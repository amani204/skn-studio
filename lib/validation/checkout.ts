import { z } from "zod";

export const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(50),
});

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, "Nom trop court").max(100),
  phone: z
    .string()
    .trim()
    .min(8, "Numéro de téléphone invalide")
    .max(20)
    .regex(/^[0-9+\s-]+$/, "Numéro de téléphone invalide"),
  wilayaCode: z.number().int().min(1).max(58),
  commune: z.string().trim().min(1, "Commune requise").max(100),
  address: z.string().trim().max(300).optional(),
  deliveryMethod: z.enum(["HOME", "DESK"]),
  notes: z.string().trim().max(1000).optional(),
  items: z.array(checkoutItemSchema).min(1, "Le panier est vide").max(50),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;