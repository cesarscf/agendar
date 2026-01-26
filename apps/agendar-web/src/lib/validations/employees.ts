import { z } from "zod";

export const employeeSchema = z.object({
  id: z.uuid(),
  name: z
    .string()
    .min(2, { message: "Nome deve ter no mínimo 2 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" }),
  email: z.email({ message: "E-mail inválido" }).optional(),
  active: z.boolean(),
  address: z.string().optional(),
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
  services: z.array(
    z.object({
      serviceId: z.string(),
      commission: z.string(),
      active: z.boolean(),
      serviceName: z.string(),
    }),
  ),
});

export const createEmployeeSchema = employeeSchema.omit({
  id: true,
  services: true,
});

export const updateEmployeeSchema = employeeSchema.partial().extend({
  id: z.string().min(1, "ID obrigatório"),
});

export const updateEmployeeServicesFormSchema = z.object({
  employeeId: z.string(),
  services: z.array(
    z.object({
      serviceId: z.string(),
      serviceName: z.string(),
      commission: z.string(),
      active: z.boolean(),
    }),
  ),
});

export const updateEmployeeServicesSchema = z.object({
  services: z.array(
    z.object({
      serviceId: z.string(),
      commission: z.string(),
      active: z.boolean(),
    }),
  ),
});

export type Employee = z.infer<typeof employeeSchema>;
export type CreateEmployeeRequest = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeRequest = z.infer<typeof updateEmployeeSchema>;

export type UpdateEmployeeServicesForm = z.infer<
  typeof updateEmployeeServicesFormSchema
>;
export type UpdateEmployeeServicesRequest = z.infer<
  typeof updateEmployeeServicesSchema
>;
