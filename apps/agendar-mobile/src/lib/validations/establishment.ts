import { z } from "zod"

export const establishmentSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(3, {
      message: "O nome do estabelecimento deve ter no mínimo 3 caracteres",
    })
    .max(100, {
      message: "O nome do estabelecimento deve ter no máximo 100 caracteres",
    }),
  theme: z.string().min(1, { message: "O tema é obrigatório" }),
  slug: z.string(),
  about: z
    .string()
    .min(10, { message: "A descrição deve ter no mínimo 10 caracteres" })
    .max(500, { message: "A descrição deve ter no máximo 500 caracteres" }),
  bannerUrl: z.string().optional(),
  logoUrl: z.string().optional(),
  phone: z.string().min(1, { message: "O telefone é obrigatório" }),
  servicesPerformed: z.string().optional(),
  activeCustomers: z.string().optional(),
  experienceTime: z.string().optional(),
  googleMapsLink: z.string().optional(),
  address: z.string().optional(),
})

export const createEstablishmentSchema = establishmentSchema.omit({ id: true })

export const updateEstablishmentSchema = establishmentSchema.partial().extend({
  id: z.string().min(1, "ID obrigatório"),
})

export type Establishment = z.infer<typeof establishmentSchema>
export type CreateEstablishmentRequest = z.infer<
  typeof createEstablishmentSchema
>
export type UpdateEstablishmentRequest = z.infer<
  typeof updateEstablishmentSchema
>
