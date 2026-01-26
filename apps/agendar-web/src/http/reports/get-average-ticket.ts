import z from "zod";
import { api } from "@/lib/api-client";

const getAverageTicketParamsSchema = z.object({
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato deve ser YYYY-MM-DD"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato deve ser YYYY-MM-DD"),
});

export type GetAverageTicketParams = z.infer<
  typeof getAverageTicketParamsSchema
>;

export type GetAverageTicket = {
  value: number;
};

export async function getAverageTicket({
  endDate,
  startDate,
}: GetAverageTicketParams) {
  const response = await api.get<GetAverageTicket>(
    "/establishments/average-ticket",
    {
      params: { endDate, startDate },
    },
  );

  return response.data;
}
