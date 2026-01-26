import { z } from "zod"

export const packageSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome obrigatório"),
  active: z.boolean(),
  commission: z
    .string()
    .min(1, "Comissão obrigatória")
    .refine(
      value => {
        const regex = /^\d+(\.\d{1,2})?$/
        return regex.test(value)
      },
      {
        message: "Comissão inválida. Use formato: 50, 50.5 ou 50.55",
      }
    ),
  price: z
    .string()
    .min(1, "Preço obrigatório")
    .refine(
      value => {
        const regex = /^(\d{1,3}(\.\d{3})*|\d+)(,\d{1,2})?$/
        return regex.test(value)
      },
      {
        message: "Preço inválido. Use formato: 10, 10,50 ou 1.000,00",
      }
    ),
  image: z.string().optional(),
  description: z
    .string()
    .max(500, { message: "Descrição deve ter no máximo 500 caracteres" })
    .optional(),
})

export const createPackageSchema = packageSchema.omit({ id: true })

export const updatePackageSchema = packageSchema.partial().extend({
  id: z.string().min(1, "ID obrigatório"),
})

export const packageItemSchema = z.object({
  serviceId: z.string(),
  quantity: z.number(),
  name: z.string(),
})

export const packageSchemaWithItems = packageSchema.extend({
  items: z.array(packageItemSchema),
})

export const updatePackageItemSchema = z.object({
  serviceId: z.string().min(1, "Selecione um serviço"),
  quantity: z.number(),
})

export const updatePackageItemsSchema = z.object({
  items: z.array(updatePackageItemSchema),
})

export type Package = z.infer<typeof packageSchema>
export type PackageWithItems = z.infer<typeof packageSchemaWithItems>

export type CreatePackageRequest = z.infer<typeof createPackageSchema>
export type UpdatePackageRequest = z.infer<typeof updatePackageSchema>

export type UpdatePackageItemRequest = z.infer<typeof updatePackageItemsSchema>

export type UpdatePackageItem = z.infer<typeof updatePackageItemSchema>
export type UpdatePackageItemsRequest = z.infer<typeof updatePackageItemsSchema>
