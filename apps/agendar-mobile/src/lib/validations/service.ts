import { z } from "zod"

// Schema de categoria simplificado para uso em serviços
export const serviceCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const serviceSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome obrigatório"),
  price: z
    .string()
    .min(1, "Preço obrigatório")
    .refine(
      value => {
        // Aceita formatos: 10, 10,5, 10,50, 1.000,00
        const regex = /^(\d{1,3}(\.\d{3})*|\d+)(,\d{1,2})?$/
        return regex.test(value)
      },
      {
        message: "Preço inválido. Use formato: 10, 10,50 ou 1.000,00",
      }
    ),
  active: z.boolean().optional(),
  durationInMinutes: z
    .string()
    .min(1, "Duração obrigatória")
    .regex(/^\d+$/, "Duração deve ser um número inteiro em minutos"),
  description: z.string().optional(),
  image: z.string().optional(),
  categories: z.array(serviceCategorySchema).optional(),
  categoryIds: z.array(z.string()).optional(),
})

export const createServiceSchema = serviceSchema.omit({
  id: true,
  categories: true,
})

export const updateServiceSchema = serviceSchema
  .partial()
  .extend({
    id: z.string().min(1, "ID obrigatório"),
  })
  .omit({ categories: true })

export type ServiceCategory = z.infer<typeof serviceCategorySchema>
export type Service = z.infer<typeof serviceSchema>
export type CreateServiceRequest = z.infer<typeof createServiceSchema>
export type UpdateServiceRequest = z.infer<typeof updateServiceSchema>
