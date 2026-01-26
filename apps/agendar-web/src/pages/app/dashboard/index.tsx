import { createFileRoute } from "@tanstack/react-router";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { parseAsIsoDate, useQueryState } from "nuqs";
import { AppointmentsCountCard } from "@/components/appointments-count-card";
import { AverageTicketCard } from "@/components/average-ticket-card";
import { DailyRevenueChart } from "@/components/daily-revenue-chart";
import { EmployeeCommissionChart } from "@/components/employee-commission-chart";
import { EmployeeRevenueChart } from "@/components/employee-revenue-chart";
import { MonthlyServicesChart } from "@/components/monthly-services-chart";
import { MostBookedServicesChart } from "@/components/most-booked-services-chart";
import { NetRevenueCard } from "@/components/net-revenue-card";
import { ServicesByEmployeeChart } from "@/components/services-by-employee-chart";
import { TopPaymentMethodsChart } from "@/components/top-payment-methods-chart";
import { TopServicesChart } from "@/components/top-services-chart";
import { TotalRevenueCard } from "@/components/total-revenue-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardFilters } from "./-components/dashboard-filters";

export const Route = createFileRoute("/app/dashboard/")({
  component: Dashboard,
});

const getCurrentMonthStart = () => startOfMonth(new Date());
const getCurrentMonthEnd = () => endOfMonth(new Date());

function Dashboard() {
  const [startDate] = useQueryState(
    "startDate",
    parseAsIsoDate.withDefault(getCurrentMonthStart()),
  );

  const [endDate] = useQueryState(
    "endDate",
    parseAsIsoDate.withDefault(getCurrentMonthEnd()),
  );

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Visão geral das suas métricas de negócio
        </p>
      </div>

      <DashboardFilters />

      <Tabs defaultValue="overview" className="space-y-4 md:space-y-6">
        <TabsList className="w-full md:w-fit overflow-x-auto">
          <TabsTrigger
            value="overview"
            className="text-xs md:text-sm px-2 md:px-3"
          >
            Visão Geral
          </TabsTrigger>
          <TabsTrigger
            value="employees"
            className="text-xs md:text-sm px-2 md:px-3"
          >
            Relatório de Profissionais
          </TabsTrigger>
          <TabsTrigger
            value="services"
            className="text-xs md:text-sm px-2 md:px-3"
          >
            Relatório por Serviço
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 md:space-y-6">
          <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
            <TotalRevenueCard
              params={{
                startDate: format(startDate, "yyyy-MM-dd"),
                endDate: format(endDate, "yyyy-MM-dd"),
              }}
            />
            <NetRevenueCard
              params={{
                startDate: format(startDate, "yyyy-MM-dd"),
                endDate: format(endDate, "yyyy-MM-dd"),
              }}
            />
            <AverageTicketCard
              params={{
                startDate: format(startDate, "yyyy-MM-dd"),
                endDate: format(endDate, "yyyy-MM-dd"),
              }}
            />
            <AppointmentsCountCard
              params={{
                startDate: format(startDate, "yyyy-MM-dd"),
                endDate: format(endDate, "yyyy-MM-dd"),
              }}
            />
          </div>

          <DailyRevenueChart
            params={{
              startDate: format(startDate, "yyyy-MM-dd"),
              endDate: format(endDate, "yyyy-MM-dd"),
            }}
          />

          <div className="grid gap-4 md:gap-6 md:grid-cols-3">
            <TopPaymentMethodsChart
              params={{
                startDate: format(startDate, "yyyy-MM-dd"),
                endDate: format(endDate, "yyyy-MM-dd"),
              }}
            />
            <TopServicesChart
              params={{
                startDate: format(startDate, "yyyy-MM-dd"),
                endDate: format(endDate, "yyyy-MM-dd"),
              }}
            />
            <MostBookedServicesChart
              params={{
                startDate: format(startDate, "yyyy-MM-dd"),
                endDate: format(endDate, "yyyy-MM-dd"),
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4 md:space-y-6">
          <div className="grid gap-4 md:gap-6 md:grid-cols-2">
            <EmployeeRevenueChart
              params={{
                startDate: format(startDate, "yyyy-MM-dd"),
                endDate: format(endDate, "yyyy-MM-dd"),
              }}
            />

            <EmployeeCommissionChart
              params={{
                startDate: format(startDate, "yyyy-MM-dd"),
                endDate: format(endDate, "yyyy-MM-dd"),
              }}
            />
          </div>

          <ServicesByEmployeeChart
            params={{
              startDate: format(startDate, "yyyy-MM-dd"),
              endDate: format(endDate, "yyyy-MM-dd"),
            }}
          />
        </TabsContent>

        <TabsContent value="services" className="space-y-4 md:space-y-6">
          <MonthlyServicesChart />
        </TabsContent>
      </Tabs>
    </div>
  );
}
