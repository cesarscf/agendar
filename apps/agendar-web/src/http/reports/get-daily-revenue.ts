import z from "zod";
import { api } from "@/lib/api-client";

const getDailyRevenueParamsSchema = z.object({
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato deve ser YYYY-MM-DD"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato deve ser YYYY-MM-DD"),
});

export type GetDailyRevenueParams = z.infer<typeof getDailyRevenueParamsSchema>;

export type GetDailyRevenue = {
  items: {
    date: string;
    value: number;
  }[];
};

export async function getDailyRevenue({
  endDate,
  startDate,
}: GetDailyRevenueParams) {
  const response = await api.get<GetDailyRevenue>(
    "/establishments/daily-revenue",
    {
      params: { endDate, startDate },
    },
  );

  return response.data;
}
