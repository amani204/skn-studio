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
  
  // Safe handling for null / optional old price
  oldPrice: z
    .preprocess(
      (val) => (val === "" || val === null ? null : val),
      z.coerce.number().positive("L'ancien prix doit être positif.").nullable()
    )
    .optional(),

  stock: z.coerce
    .number()
    .int("Le stock doit être un nombre entier.")
    .min(0, "Le stock ne peut pas être négatif."),
  
  // Relaxed from cuid() to min(1) to avoid breaking on UUID or non-CUID category IDs
  categoryId: z.string().min(1, "Catégorie invalide."),
  
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  images: z
    .array(productImageSchema)
    .min(1, "Au moins une image est requise.")
    .max(8, "8 images maximum par produit."),
});


export const createProductSchema = productBaseSchema.refine(
  (data) => !data.oldPrice || data.oldPrice > data.price,
  {
    message: "L'ancien prix doit être supérieur au prix actuel.",
    path: ["oldPrice"],
  }
);

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