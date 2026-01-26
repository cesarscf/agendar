import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { CancelAppointmentParams } from "@/http/appointments/cancel-appointment"
import { cancelAppointment } from "@/http/appointments/cancel-appointment"
import type {
  AppointmentStatus,
  PaymentType,
} from "@/http/appointments/checkin"
import { checkin } from "@/http/appointments/checkin"
import type { CreateAppointmentRequest } from "@/http/appointments/create-appointment"
import { createAppointment } from "@/http/appointments/create-appointment"
import type { CreateAppointmentWithPackageRequest } from "@/http/appointments/create-appointment-with-package"
import { createAppointmentWithPackage } from "@/http/appointments/create-appointment-with-package"
import type { GetAppointmentsParams } from "@/http/appointments/get-appointments"
import { getAppointments } from "@/http/appointments/get-appointments"
import { queryKeys } from "@/lib/query-keys"

// ========== QUERIES ==========

export function useAppointments(params?: GetAppointmentsParams) {
  return useQuery({
    queryKey: queryKeys.appointments(params as Record<string, unknown>),
    queryFn: () => getAppointments(params),
  })
}

// ========== MUTATIONS ==========

export function useCreateAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAppointmentRequest) => createAppointment(data),
    onSuccess: () => {
      // Invalidate all appointment queries since we don't know the exact params
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
    },
  })
}

export function useCreateAppointmentWithPackage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAppointmentWithPackageRequest) =>
      createAppointmentWithPackage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
    },
  })
}

export function useCheckin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      appointmentId: string
      status: AppointmentStatus
      paymentType: PaymentType
      notes?: string
      paymentAmount: string
    }) => checkin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      // Also invalidate customer data as loyalty points might change
      queryClient.invalidateQueries({ queryKey: queryKeys.customers })
    },
  })
}

export function useCancelAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CancelAppointmentParams) => cancelAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
    },
  })
}
