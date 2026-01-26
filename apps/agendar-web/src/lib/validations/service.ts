import { z } from "zod";

export const serviceSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome obrigatório"),
  price: z.string().min(1, "Preço obrigatório"),
  active: z.boolean().optional(),
  durationInMinutes: z
    .string()
    .min(1, "Duração obrigatória")
    .regex(/^\d+$/, "Duração deve ser um número inteiro em minutos"),
  description: z.string().optional(),
  image: z.string().optional(),
  categories: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .optional(),
  categoryIds: z.array(z.string()).optional(),
});

export const createServiceSchema = serviceSchema.omit({
  id: true,
  categories: true,
});

export const updateServiceSchema = serviceSchema
  .omit({ categories: true })
  .partial()
  .extend({
    id: z.string().min(1, "ID obrigatório"),
  });

export type Service = z.infer<typeof serviceSchema>;
export type CreateServiceRequest = z.infer<typeof createServiceSchema>;
export type UpdateServiceRequest = z.infer<typeof updateServiceSchema>;
