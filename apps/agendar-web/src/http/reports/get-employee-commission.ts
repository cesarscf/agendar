import z from "zod";
import { api } from "@/lib/api-client";

const getEmployeeCommissionParamsSchema = z.object({
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato deve ser YYYY-MM-DD"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato deve ser YYYY-MM-DD"),
});

export type GetEmployeeCommissionParams = z.infer<
  typeof getEmployeeCommissionParamsSchema
>;

export type GetEmployeeCommission = {
  items: {
    employee: string;
    revenueInCents: number;
  }[];
};

export async function getEmployeeCommission({
  endDate,
  startDate,
}: GetEmployeeCommissionParams) {
  const response = await api.get<GetEmployeeCommission>(
    "/establishments/employee-commission",
    {
      params: { endDate, startDate },
    },
  );

  return response.data;
}
