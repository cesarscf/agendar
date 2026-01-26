import z from "zod";
import { api } from "@/lib/api-client";

const getTopPaymentMethodsParamsSchema = z.object({
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato deve ser YYYY-MM-DD"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato deve ser YYYY-MM-DD"),
});

export type GetTopPaymentMethodsParams = z.infer<
  typeof getTopPaymentMethodsParamsSchema
>;

export type GetTopPaymentMethods = {
  items: {
    method:
      | "pix"
      | "credit_card"
      | "debit_card"
      | "cash"
      | "package"
      | "loyalty"
      | "other";
    usage: number;
  }[];
};

export async function getTopPaymentMethods({
  endDate,
  startDate,
}: GetTopPaymentMethodsParams) {
  const response = await api.get<GetTopPaymentMethods>(
    "/establishments/top-payment-methods",
    {
      params: { endDate, startDate },
    },
  );

  return response.data;
}
