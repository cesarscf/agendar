import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { RefreshCw } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  type GetAppointmentsParams,
  getAppointments,
} from "@/http/appointments/get-appointments";
import { getEmployees } from "@/http/employees/get-employees";
import { getServices } from "@/http/services/get-services";
import { AppointmentsEmpty } from "./-components/appointments-empty";
import { AppointmentsFilters } from "./-components/appointments-filters";
import { AppointmentsPagination } from "./-components/appointments-pagination";
import { AppointmentsSkeleton } from "./-components/appointments-skeleton";
import { AppointmentsTable } from "./-components/appointments-table";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();

  const today = format(new Date(), "yyyy-MM-dd");

  const [filters, setFilters] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
    status: parseAsString.withDefault("scheduled"),
    startDate: parseAsString.withDefault(today),
    endDate: parseAsString.withDefault(today),
    search: parseAsString,
    serviceId: parseAsString,
    employeeId: parseAsString,
  });

  const queryParams: GetAppointmentsParams = {
    page: filters.page,
    perPage: filters.perPage,
    ...(filters.status !== "all" && {
      status: filters.status as "scheduled" | "completed" | "canceled",
    }),
    ...(filters.startDate && { startDate: filters.startDate }),
    ...(filters.endDate && { endDate: filters.endDate }),
    ...(filters.search && { search: filters.search }),
    ...(filters.serviceId && { serviceId: filters.serviceId }),
    ...(filters.employeeId && { employeeId: filters.employeeId }),
  };

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["appointments", queryParams],
    queryFn: () => getAppointments(queryParams),
    refetchInterval: 5 * 60 * 1000,
  });

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const { data: employees } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });

  const totalPages = data ? Math.ceil(data.total / filters.perPage) : 0;

  const clearFilters = () => {
    setFilters({
      page: 1,
      status: "all",
      startDate: null,
      endDate: null,
      search: null,
      serviceId: null,
      employeeId: null,
    });
  };

  const handlePageChange = (page: number) => setFilters({ page });

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleInvalidateQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ["appointments", queryParams],
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-foreground">Agendamentos</h1>
        <Button
          onClick={() => refetch()}
          disabled={isFetching}
          variant="outline"
          size="sm"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
          />
          Atualizar
        </Button>
      </div>

      <AppointmentsFilters
        filters={filters}
        services={services}
        employees={employees}
        onFiltersChange={handleFiltersChange}
        onClearFilters={clearFilters}
      />

      <Card className="shadow-sm p-0">
        <CardContent className="p-4">
          {isLoading ? (
            <AppointmentsSkeleton />
          ) : !data?.appointments.length ? (
            <AppointmentsEmpty />
          ) : (
            <div className="space-y-4">
              <AppointmentsTable
                appointments={data.appointments}
                onInvalidateQueries={handleInvalidateQueries}
              />

              <AppointmentsPagination
                currentPage={filters.page}
                totalPages={totalPages}
                perPage={filters.perPage}
                total={data.total}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
