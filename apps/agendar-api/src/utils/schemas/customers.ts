import { z } from "zod"

export const customerSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  birthDate: z.coerce.date().nullable().optional(),
  phoneNumber: z.string(),
  email: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  cpf: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
})
