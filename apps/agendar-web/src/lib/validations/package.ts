import z from "zod"

export const packageSchema = z.object({
  id: z.uuid({ message: "ID inválido" }),
  name: z
    .string()
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" }),
  active: z.boolean(),
  commission: z
    .string()
    .min(1, "Preço obrigatório")
    .regex(/^\d+(.\d{1,2})?$/, "Preço inválido. Ex: 10 ou 10.99"),
  price: z.string().min(1, "Preço obrigatório"),
  description: z
    .string()
    .max(500, { message: "Descrição deve ter no máximo 500 caracteres" })
    .optional(),
  image: z.string().optional(),
  serviceId: z.uuid({ message: "Selecione um serviço" }),
  quantity: z
    .number({ message: "Quantidade deve ser um número" })
    .int({ message: "Quantidade deve ser um número inteiro" })
    .positive({ message: "Quantidade deve ser maior que zero" }),
})

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

export const updatePackageItemsSchema = z.object({
  items: z.array(packageItemSchema),
})

export const updatePackageItemsRequestSchema = z.object({
  items: z.array(
    packageItemSchema.omit({
      name: true,
    })
  ),
})

export const createPackageSchema = packageSchema.omit({ id: true })

export type Package = z.infer<typeof packageSchema>
export type UpdatePackageRequest = z.infer<typeof updatePackageSchema>
export type CreatePackageRequest = z.infer<typeof createPackageSchema>

export type PackageWithItems = z.infer<typeof packageSchemaWithItems>

export type PackageItem = z.infer<typeof packageItemSchema>
export type UpdatePackageItems = z.infer<typeof updatePackageItemsSchema>
export type UpdatePackageItemsRequest = z.infer<
  typeof updatePackageItemsRequestSchema
>
