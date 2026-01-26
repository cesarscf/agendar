import { api } from "@/lib/api-client"
import { onlyNumbers, parseDateString } from "@/lib/utils"
import type { UpdateCustomerRequest } from "@/lib/validations/customer"

export async function updateCustomer(inputs: UpdateCustomerRequest) {
  const payload = {
    ...inputs,
    phone: inputs.phoneNumber ? onlyNumbers(inputs.phoneNumber) : undefined,
    birthDate: inputs.birthDate ? parseDateString(inputs.birthDate) : undefined,
    cpf: inputs.cpf ? onlyNumbers(inputs.cpf) : undefined,
  }

  await api.put(`/customers/${inputs.id}`, payload)
}
