import z from "zod"
import { api } from "@/lib/api-client"

const getTopServicesParamsSchema = z.object({
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato deve ser YYYY-MM-DD"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato deve ser YYYY-MM-DD"),
})

export type GetTopServicesParams = z.infer<typeof getTopServicesParamsSchema>

export type GetTopServices = {
  items: {
    service: string
    totalRevenueInCents: string
  }[]
}

export async function getTopServices({
  endDate,
  startDate,
}: GetTopServicesParams) {
  const response = await api.get<GetTopServices>(
    "/establishments/top-services",
    {
      params: { endDate, startDate },
    }
  )

  return response.data
}
