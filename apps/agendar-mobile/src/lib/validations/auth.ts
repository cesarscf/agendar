import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um endereço de e-mail válido",
  }),
  password: z
    .string()
    .min(8, {
      message: "A senha deve ter no mínimo 8 caracteres",
    })
    .max(100, {
      message: "A senha deve ter no máximo 100 caracteres",
    }),
})

export const registerSchema = loginSchema.extend({
  name: z
    .string({ message: "Por favor, insira seu nome completo" })
    .min(4, { message: "O nome é obrigatório" })
    .refine(value => value.trim().includes(" "), {
      message: "Por favor, insira seu nome completo",
    }),
  state: z.string().optional(),
  city: z.string().optional(),
})
