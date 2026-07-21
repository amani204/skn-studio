import { z } from "zod";

export const productImageSchema = z.object({
  url: z.string().url("URL d'image invalide."),
  alt: z.string().max(200).optional().nullable(),
  order: z.number().int().min(0).default(0),
});

const productBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(200, "Le nom est trop long."),
  description: z
    .string()
    .trim()
    .min(10, "La description doit contenir au moins 10 caractères.")
    .max(5000, "La description est trop longue."),
  price: z.coerce.number().positive("Le prix doit être un nombre positif."),
  oldPrice: z.coerce.number().positive().optional().nullable(),
  stock: z.coerce
    .number()
    .int("Le stock doit être un nombre entier.")
    .min(0, "Le stock ne peut pas être négatif."),
  categoryId: z.string().cuid("Catégorie invalide."),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  images: z
    .array(productImageSchema)
    .min(1, "Au moins une image est requise.")
    .max(8, "8 images maximum par produit."),
});

// POST /api/admin/products/new — everything required
export const createProductSchema = productBaseSchema.refine(
  (data) => !data.oldPrice || data.oldPrice > data.price,
  {
    message: "L'ancien prix doit être supérieur au prix actuel.",
    path: ["oldPrice"],
  }
);

// PUT /api/admin/products/[id] — partial update, but still validated when present
export const updateProductSchema = productBaseSchema
  .partial()
  .extend({
    images: z.array(productImageSchema).max(8, "8 images maximum par produit.").optional(),
  })
  .refine(
    (data) => !data.oldPrice || !data.price || data.oldPrice > data.price,
    {
      message: "L'ancien prix doit être supérieur au prix actuel.",
      path: ["oldPrice"],
    }
  );

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;