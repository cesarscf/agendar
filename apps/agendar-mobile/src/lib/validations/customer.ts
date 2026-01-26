import { z } from "zod"

export const customerSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .min(3, { message: "O nome deve ter no mínimo 3 caracteres" })
    .max(100, { message: "O nome deve ter no máximo 100 caracteres" }),
  birthDate: z.coerce.date({
    errorMap: () => ({ message: "Data de nascimento inválida" }),
  }),
  phoneNumber: z.string().min(1, { message: "O telefone é obrigatório" }),
  email: z.string().optional(),
  address: z.string().optional(),
  cpf: z.string().optional(),
  notes: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
})

export const createCustomerSchema = customerSchema.omit({ id: true })
export const updateCustomerSchema = customerSchema.partial().extend({
  id: z.string().min(1, "ID obrigatório"),
})

export type Customer = z.infer<typeof customerSchema>
export type CreateCustomerRequest = z.infer<typeof createCustomerSchema>
export type UpdateCustomerRequest = z.infer<typeof updateCustomerSchema>
