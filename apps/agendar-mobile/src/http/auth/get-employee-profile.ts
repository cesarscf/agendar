import { handleApiError } from "@/utils"
import { api } from "../api-client"

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

interface GetEmployeeProfileResponse {
  employee: EmployeeProfile
  establishment: EmployeeEstablishment
}

export async function getEmployeeProfile() {
  try {
    const response =
      await api.get<GetEmployeeProfileResponse>(
        "/employee/me"
      )

    return {
      data: response.data,
      error: null,
    }
  } catch (err) {
    const { error } = handleApiError(err)

    return {
      data: null,
      error,
    }
  }
}
