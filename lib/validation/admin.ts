import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(1, "Nom requis").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug requis")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug invalide (minuscules, chiffres, tirets uniquement)"),
  description: z.string().trim().min(1, "Description requise").max(5000),
  price: z.number().positive("Le prix doit être positif"),
  oldPrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0),
  categoryId: z.string().min(1, "Catégorie requise"),
  isPublished: z.boolean(),
  isFeatured: z.boolean().optional(),
});

export const orderStatusSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

export const deliveryRateSchema = z.object({
  homePrice: z.number().min(0),
  deskPrice: z.number().min(0),
  isActive: z.boolean().optional(),
});

export const adminSettingsSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  currentPassword: z.string().min(1).optional(),
  newPassword: z.string().min(8, "8 caractères minimum").max(100).optional(),
});


export const createAdminSchema = z.object({
  name: z.string().trim().max(100).optional().nullable(),
  email: z.string().trim().toLowerCase().email("Adresse e-mail invalide."),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
    .max(72, "Le mot de passe est trop long."), // bcrypt silently truncates beyond 72 bytes
});
 
export type CreateAdminInput = z.infer<typeof createAdminSchema>;