import { format } from "date-fns";
import { api } from "@/lib/api-client";

export type CreateAppointmentWithPackageRequest = {
  employeeId: string;
  packageId: string;
  date: Date;
  startTime: Date;
  customerPhone: string;
  establishmentId: string;
};

export async function createAppointmentWithPackage(
  inputs: CreateAppointmentWithPackageRequest,
) {
  const utcTime = new Date(inputs.startTime.toISOString());

  const payload = {
    employeeId: inputs.employeeId,
    packageId: inputs.packageId,
    date: format(inputs.date, "yyyy-MM-dd"),
    startTime: utcTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "UTC",
    }),
  };

  await api.post("/appointments/use-package", payload, {
    headers: {
      "x-establishment-id": inputs.establishmentId,
      "x-customer-phone": inputs.customerPhone,
    },
  });
}
