import { z } from "zod"

export const pointRuleSchema = z.object({
  serviceId: z.string(),
  serviceName: z.string(),
  points: z.number(),
})

export const loyaltyProgramSchema = z.object({
  id: z.string(),
  name: z.string(),
  serviceRewardId: z.string(),
  serviceRewardName: z.string(),
  requiredPoints: z.number(),
  active: z.boolean(),
  rules: z.array(pointRuleSchema),
})

export const createLoyaltyProgramRuleSchema = z.object({
  serviceId: z.string().min(1, "Selecione um serviço"),
  points: z.number().min(1, "Os pontos devem ser pelo menos 1"),
})

export const createLoyaltyProgramSchema = z.object({
  serviceRewardId: z.string().min(1, "Selecione um serviço de recompensa"),
  name: z.string().min(1, "O nome é obrigatório"),
  requiredPoints: z
    .number()
    .min(1, "Os pontos necessários devem ser pelo menos 1"),
  rules: z
    .array(createLoyaltyProgramRuleSchema)
    .min(1, "Adicione pelo menos uma regra"),
})

export const updateLoyaltyProgramRuleSchema = z.object({
  serviceId: z.string().min(1, "Selecione um serviço"),
  points: z.number().min(1, "Os pontos devem ser pelo menos 1"),
  serviceName: z.string().optional(),
})

export const updateLoyaltyProgramSchema = z.object({
  id: z.string(),
  serviceRewardId: z.string().min(1, "Selecione um serviço de recompensa"),
  name: z.string().min(1, "O nome é obrigatório"),
  requiredPoints: z
    .number()
    .min(1, "Os pontos necessários devem ser pelo menos 1"),
  rules: z
    .array(updateLoyaltyProgramRuleSchema)
    .min(1, "Adicione pelo menos uma regra"),
})

export type PointRule = z.infer<typeof pointRuleSchema>
export type LoyaltyProgram = z.infer<typeof loyaltyProgramSchema>
export type CreateLoyaltyProgramRule = z.infer<
  typeof createLoyaltyProgramRuleSchema
>
export type CreateLoyaltyProgramRequest = z.infer<
  typeof createLoyaltyProgramSchema
>
export type UpdateLoyaltyProgramRule = z.infer<
  typeof updateLoyaltyProgramRuleSchema
>
export type UpdateLoyaltyProgramRequest = z.infer<
  typeof updateLoyaltyProgramSchema
>
