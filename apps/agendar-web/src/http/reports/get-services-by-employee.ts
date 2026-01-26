import z from "zod"
import { api } from "@/lib/api-client"

const getServicesByEmployeeParamsSchema = z.object({
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato deve ser YYYY-MM-DD"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato deve ser YYYY-MM-DD"),
})

export type GetServicesByEmployeeParams = z.infer<
  typeof getServicesByEmployeeParamsSchema
>

export type GetServicesByEmployee = {
  items: {
    employee: string
    totalBookings: number
  }[]
}

export async function getServicesByEmployee({
  endDate,
  startDate,
}: GetServicesByEmployeeParams) {
  const response = await api.get<GetServicesByEmployee>(
    "/establishments/services-by-employee",
    {
      params: { endDate, startDate },
    }
  )

  return response.data
}
