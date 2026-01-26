import { api } from "@/lib/api-client";

export type Appointment = {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  service: {
    id: string;
    name: string;
    servicePrice: string;
  };
  professional: {
    id: string;
    name: string;
  };
  customer: {
    id: string;
    name: string;
    phoneNumber: string;
  };
  package?: {
    id: string;
    name: string;
    description: string | null;
    price: string;
    remainingSessions: number;
    totalSessions: number;
    paid: boolean;
  };
};

export interface GetAppointmentsReponse {
  appointments: Appointment[];
  total: number;
}

export interface GetAppointmentsParams {
  page?: number;
  perPage?: number;
  startDate?: string;
  endDate?: string;
  status?: "scheduled" | "completed" | "canceled";
  employeeId?: string;
  serviceId?: string;
}

export async function getAppointments(params?: GetAppointmentsParams) {
  const response = await api.get<GetAppointmentsReponse>(
    "/establishments/appointments",
    { params },
  );

  return response.data;
}
