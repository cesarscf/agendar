import { useState } from "react"
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native"
import { cn } from "@/utils/cn"
import { useDashboardFilters } from "@/hooks/use-dashboard-filters"
import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { TotalRevenueCard } from "@/components/dashboard/total-revenue-card"
import { NetRevenueCard } from "@/components/dashboard/net-revenue-card"
import { AverageTicketCard } from "@/components/dashboard/average-ticket-card"
import { AppointmentsCountCard } from "@/components/dashboard/appointments-count-card"
import { DailyRevenueChart } from "@/components/dashboard/daily-revenue-chart"
import { TopServicesChart } from "@/components/dashboard/top-services-chart"
import { MostBookedServicesChart } from "@/components/dashboard/most-booked-services-chart"
import { TopPaymentMethodsChart } from "@/components/dashboard/top-payment-methods-chart"
import { EmployeeRevenueChart } from "@/components/dashboard/employee-revenue-chart"
import { EmployeeCommissionChart } from "@/components/dashboard/employee-commission-chart"
import { ServicesByEmployeeChart } from "@/components/dashboard/services-by-employee-chart"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "employees">(
    "overview"
  )
  const {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    clearFilters,
    isLoading,
  } = useDashboardFilters()

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-white">
      <View className="border-b border-gray-200 bg-white">
        <View className="flex-row p-2">
          <Pressable
            onPress={() => setActiveTab("overview")}
            className={cn(
              "flex-1 py-3 rounded-lg mx-1",
              activeTab === "overview" ? "bg-[#3B82F6]" : "bg-gray-100"
            )}
          >
            <Text
              className={cn(
                "text-center font-semibold",
                activeTab === "overview" ? "text-white" : "text-gray-600"
              )}
            >
              Visão Geral
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("employees")}
            className={cn(
              "flex-1 py-3 rounded-lg mx-1",
              activeTab === "employees" ? "bg-[#3B82F6]" : "bg-gray-100"
            )}
          >
            <Text
              className={cn(
                "text-center font-semibold",
                activeTab === "employees" ? "text-white" : "text-gray-600"
              )}
            >
              Profissionais
            </Text>
          </Pressable>
        </View>
      </View>

      <DashboardFilters
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onClearFilters={clearFilters}
      />

      {activeTab === "overview" && (
        <ScrollView className="flex-1 bg-gray-50">
          <View className="p-4 gap-4">
            <View className="flex-row gap-3">
              <View className="flex-1">
                <TotalRevenueCard startDate={startDate} endDate={endDate} />
              </View>
              <View className="flex-1">
                <NetRevenueCard startDate={startDate} endDate={endDate} />
              </View>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <AverageTicketCard startDate={startDate} endDate={endDate} />
              </View>
              <View className="flex-1">
                <AppointmentsCountCard
                  startDate={startDate}
                  endDate={endDate}
                />
              </View>
            </View>

            <DailyRevenueChart startDate={startDate} endDate={endDate} />

            <TopPaymentMethodsChart startDate={startDate} endDate={endDate} />

            <TopServicesChart startDate={startDate} endDate={endDate} />

            <MostBookedServicesChart startDate={startDate} endDate={endDate} />
          </View>
        </ScrollView>
      )}

      {activeTab === "employees" && (
        <ScrollView className="flex-1 bg-gray-50">
          <View className="p-4 gap-4">
            <EmployeeRevenueChart startDate={startDate} endDate={endDate} />

            <EmployeeCommissionChart startDate={startDate} endDate={endDate} />

            <ServicesByEmployeeChart startDate={startDate} endDate={endDate} />
          </View>
        </ScrollView>
      )}
    </View>
  )
}
