import z from "zod";
import { api } from "@/lib/api-client";

const getAppointmentsMetricsParamsSchema = z.object({
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato deve ser YYYY-MM-DD"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato deve ser YYYY-MM-DD"),
});

export type GetAppointmentsMetricsParams = z.infer<
  typeof getAppointmentsMetricsParamsSchema
>;

export type GetAppointmentsMetricsResponse = {
  value: number; // Clientes únicos atendidos
  appointmentsCount: number; // Total de agendamentos realizados
};

export async function getAppointmentsMetrics({
  endDate,
  startDate,
}: GetAppointmentsMetricsParams) {
  const response = await api.get<GetAppointmentsMetricsResponse>(
    "/establishments/appointments-metrics",
    {
      params: { endDate, startDate },
    },
  );

  return response.data;
}
