import z from "zod";
import { api } from "@/lib/api-client";

const getMostBookedServicesParamsSchema = z.object({
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato deve ser YYYY-MM-DD"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato deve ser YYYY-MM-DD"),
});

export type GetMostBookedServicesParams = z.infer<
  typeof getMostBookedServicesParamsSchema
>;

export type GetMostBookedServices = {
  items: {
    service: string;
    totalBookings: number;
  }[];
};

export async function getMostBookedServices({
  endDate,
  startDate,
}: GetMostBookedServicesParams) {
  const response = await api.get<GetMostBookedServices>(
    "/establishments/most-booked-services",
    {
      params: { endDate, startDate },
    },
  );

  return response.data;
}
