import { api } from "@/lib/api-client"

export type EmployeeProfile = {
  id: string
  name: string
  email: string | null
  phone: string | null
  avatarUrl: string | null
  biography: string | null
}

export type EmployeeEstablishment = {
  id: string
  name: string
}

export interface GetEmployeeProfileResponse {
  employee: EmployeeProfile
  establishment: EmployeeEstablishment
}

export async function getEmployeeProfile() {
  const response =
    await api.get<GetEmployeeProfileResponse>("/employee/me")
  return response.data
}
