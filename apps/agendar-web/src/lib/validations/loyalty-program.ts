import z from "zod"

export const pointRuleSchema = z.object({
  serviceId: z.uuid(),
  serviceName: z.string(),
  points: z.number().int().min(1),
})

export const loyaltyProgramSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  serviceRewardId: z.uuid(),
  serviceRewardName: z.string(),
  requiredPoints: z.number(),
  active: z.boolean(),
  rules: z.array(pointRuleSchema),
})

export const createPointRuleSchema = z.object({
  serviceId: z.string().min(1, "Selecione um serviço"),
  points: z.number().min(1, "Os pontos devem ser pelo menos 1"),
})

export const createLoyaltyProgramSchema = z.object({
  serviceRewardId: z.string().min(1, "Selecione um serviço de recompensa"),
  name: z.string().min(1, "O nome é obrigatório"),
  requiredPoints: z
    .number()
    .min(1, "Os pontos necessários devem ser pelo menos 1"),
  rules: z.array(createPointRuleSchema).min(1, "Adicione pelo menos uma regra"),
})

export const updatePointRuleSchema = z.object({
  serviceId: z.string().min(1, "Selecione um serviço"),
  points: z.number().min(1, "Os pontos devem ser pelo menos 1"),
  serviceName: z.string().optional(),
})

export const updateLoyaltyProgramSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "O nome é obrigatório"),
  serviceRewardId: z.string().min(1, "Selecione um serviço de recompensa"),
  requiredPoints: z
    .number()
    .min(1, "Os pontos necessários devem ser pelo menos 1"),
  rules: z.array(updatePointRuleSchema).min(1, "Adicione pelo menos uma regra"),
})

export type PointRule = z.infer<typeof pointRuleSchema>
export type LoyaltyProgram = z.infer<typeof loyaltyProgramSchema>

export type CreateLoyaltyProgram = z.infer<typeof createLoyaltyProgramSchema>
export type UpdateLoyaltyProgram = z.infer<typeof updateLoyaltyProgramSchema>
