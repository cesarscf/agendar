import z from "zod";
import { api } from "@/lib/api-client";

const getNetRevenueParamsSchema = z.object({
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato deve ser YYYY-MM-DD"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato deve ser YYYY-MM-DD"),
});

export type GetNetRevenueParams = z.infer<typeof getNetRevenueParamsSchema>;

export type GetNetRevenue = {
  value: number;
};

export async function getNetRevenue({
  endDate,
  startDate,
}: GetNetRevenueParams) {
  const response = await api.get<GetNetRevenue>("/establishments/net-revenue", {
    params: { endDate, startDate },
  });

  return response.data;
}
