import { z } from "zod"

export const employeeServiceSchema = z.object({
  serviceId: z.string(),
  serviceName: z.string(),
  commission: z.string(),
  active: z.boolean(),
})

export const employeeSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .min(2, { message: "Nome deve ter no mínimo 2 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }).optional(),
  address: z.string().optional(),
  active: z.boolean(),
  avatarUrl: z.string().optional(),
  phone: z
    .string()
    .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, {
      message: "Telefone inválido",
    })
    .optional(),
  biography: z
    .string()
    .max(500, { message: "Biografia deve ter no máximo 500 caracteres" })
    .optional(),
  services: z.array(employeeServiceSchema).optional(),
})

export const createEmployeeSchema = employeeSchema.omit({ id: true })

export const updateEmployeeSchema = employeeSchema.partial().extend({
  id: z.string().min(1, "ID obrigatório"),
})

export const updateEmployeeServicesSchema = z.object({
  employeeId: z.string(),
  services: z.array(employeeServiceSchema),
})

export type Employee = z.infer<typeof employeeSchema>
export type CreateEmployeeRequest = z.infer<typeof createEmployeeSchema>
export type UpdateEmployeeRequest = z.infer<typeof updateEmployeeSchema>
export type EmployeeService = z.infer<typeof employeeServiceSchema>
export type UpdateEmployeeServicesRequest = z.infer<
  typeof updateEmployeeServicesSchema
>
