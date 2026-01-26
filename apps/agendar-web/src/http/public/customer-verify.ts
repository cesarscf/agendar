import { api } from "@/lib/api-client";
import { onlyNumbers } from "@/lib/utils";

export type CustomerVerified = {
  id: string;
  name: string;
  email: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  birthDate: string;
  phoneNumber: string;
  cpf: string | null;
  notes: string | null;
  hasPackageAvailable?: boolean;
};

export async function customerVerify(
  phone: string,
  slug: string,
  packageId?: string,
) {
  const response = await api.get<CustomerVerified>("/customers/verify", {
    params: {
      phone: onlyNumbers(phone),
      slug: slug,
      packageId,
    },
  });

  return response.data;
}
