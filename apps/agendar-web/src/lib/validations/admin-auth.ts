import { z } from "zod"

export const adminLoginSchema = z.object({
  email: z.email({
    message: "Por favor, insira um endereco de e-mail valido",
  }),
  password: z.string().min(1, {
    message: "A senha e obrigatoria",
  }),
})
