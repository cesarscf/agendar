import { useQuery } from "@tanstack/react-query"

import {
  getAppointments,
  type GetAppointmentsParams,
} from "@/http/appointments/get-appointments"

export type Appointment = {
  id: string
  startTime: string
  endTime: string
  status: "scheduled" | "completed" | "canceled"
  service: {
    id: string
    name: string
    servicePrice: string
  }
  professional: {
    id: string
    name: string
  }
  customer: {
    id: string
    name: string
    phoneNumber: string
  }
  package?: {
    id: string
    name: string
    description: string | null
    price: string
    remainingSessions: number
    totalSessions: number
    paid: boolean
  }
}

export interface GetAppointmentsReponse {
  appointments: Appointment[]
  total: number
}

export function useAppointments(params: GetAppointmentsParams = {}) {
  return useQuery<GetAppointmentsReponse, Error>({
    queryKey: ["appointments", params],
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await getAppointments(params)

      if (error) {
        throw new Error(error)
      }

      return data!
    },
  })
}
