import { z } from "zod"

export const customerSchema = z.object({
  id: z.string().uuid({
    message: "ID inválido (deve ser um UUID)",
  }),
  name: z
    .string()
    .min(2, { message: "Nome deve ter pelo menos 2 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" }),
  birthDate: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, {
      message: "Data de nascimento deve estar no formato DD/MM/AAAA",
    })
    .optional()
    .or(z.literal("")),
  phoneNumber: z
    .string()
    .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, {
      message: "Telefone inválido",
    })
    .optional(),
  email: z.string().optional(),
  cpf: z.string().optional(),
  notes: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
})

export const createCustomerSchema = customerSchema.omit({ id: true })
export const updateCustomerSchema = customerSchema.partial().extend({
  id: z.string().min(1, "ID obrigatório"),
})

export type Customer = z.infer<typeof customerSchema>
export type CreateCustomerRequest = z.infer<typeof createCustomerSchema>
export type UpdateCustomerRequest = z.infer<typeof updateCustomerSchema>
