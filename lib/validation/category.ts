import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(100, "Le nom est trop long."),
  image: z.string().url("URL d'image invalide.").optional().nullable(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;