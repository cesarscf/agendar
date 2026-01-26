import { api } from "@/lib/api-client";

export type GetMonthlyServices = {
  items: {
    value: number;
    month: string;
  }[];
};

export async function getMonthlyServices({
  serviceId,
}: {
  serviceId?: string;
}) {
  const response = await api.get<GetMonthlyServices>(
    "/establishments/monthly-services",
    {
      params: serviceId ? { serviceId } : {},
    },
  );

  return response.data;
}
