import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({
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
  rememberMe: z.boolean().default(false),
});

export const preRegisterSchema = z.object({
  name: z
    .string({ message: "Por favor, insira seu nome completo" })
    .min(4, { message: "O nome é obrigatório" })
    .refine((value) => value.trim().includes(" "), {
      message: "Por favor, insira seu nome completo",
    }),
  email: z.string().email({
    message: "Por favor, insira um endereço de e-mail válido",
  }),
});

export const registerSchema = z
  .object({
    code: z
      .string()
      .length(6, { message: "O código deve ter 6 dígitos" })
      .regex(/^\d+$/, { message: "O código deve conter apenas números" }),
    name: z
      .string({ message: "Por favor, insira seu nome completo" })
      .min(4, { message: "O nome é obrigatório" })
      .refine((value) => value.trim().includes(" "), {
        message: "Por favor, insira seu nome completo",
      }),
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
    confirmPassword: z.string().min(8, {
      message: "A confirmação de senha deve ter no mínimo 8 caracteres",
    }),
    state: z.string().min(2, { message: "O estado é obrigatório" }),
    city: z.string().min(2, { message: "A cidade é obrigatória" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
