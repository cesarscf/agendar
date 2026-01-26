import { format } from "date-fns";
import { api } from "@/lib/api-client";

export type CreateAppointmentRequest = {
  employeeId: string;
  serviceId: string;
  date: Date;
  startTime: Date;
  customerPhone: string;
  establishmentId: string;
};

export async function createAppointment(inputs: CreateAppointmentRequest) {
  const utcTime = new Date(inputs.startTime.toISOString());

  const payload = {
    employeeId: inputs.employeeId,
    serviceId: inputs.serviceId,
    date: format(inputs.date, "yyyy-MM-dd"),
    startTime: utcTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "UTC",
    }),
  };

  await api.post("/appointments", payload, {
    headers: {
      "x-establishment-id": inputs.establishmentId,
      "x-customer-phone": inputs.customerPhone,
    },
  });
}
