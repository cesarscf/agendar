import { View, Text, ScrollView, ActivityIndicator } from "react-native"
import { useCustomerPackages } from "@/hooks/data/customers/use-customer-packages"
import type { CustomerPackage } from "@/http/customers/get-customer-packages"
import { Badge } from "./badge"
import { cn } from "@/utils/cn"

interface CustomerPackagesProps {
  customerId: string
}

export function CustomerPackages({ customerId }: CustomerPackagesProps) {
  const { data: packages, isLoading, error } = useCustomerPackages(customerId)

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <ActivityIndicator size="large" color="#fbdd65" />
        <Text className="mt-4 text-gray-600">Carregando pacotes...</Text>
      </View>
    )
  }

  // Error state
  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <Text className="text-red-600 text-center">
          Erro ao carregar pacotes do cliente
        </Text>
        <Text className="text-gray-500 text-center mt-2">{error}</Text>
      </View>
    )
  }

  // Empty state
  if (!packages || packages.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <View className="bg-gray-100 p-6 rounded-full mb-4">
          <Text className="text-4xl">📦</Text>
        </View>
        <Text className="text-lg font-semibold text-gray-900 mb-2">
          Nenhum pacote encontrado
        </Text>
        <Text className="text-gray-600 text-center">
          Este cliente ainda não possui nenhum pacote de serviços.
        </Text>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <View className="flex-row items-center mb-4">
          <Text className="text-xl font-bold text-gray-900">
            📦 Pacotes de Serviços
          </Text>
        </View>

        <View className="gap-4">
          {packages.map(pkg => (
            <PackageCard key={pkg.id} package={pkg} />
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

interface PackageCardProps {
  package: CustomerPackage
}

function PackageCard({ package: pkg }: PackageCardProps) {
  const getPackageStatus = () => {
    if (pkg.remainingSessions === 0) {
      return {
        label: "Finalizado",
        icon: "✓",
        variant: "completed" as const,
      }
    }
    if (pkg.remainingSessions > 0) {
      return {
        label: "Em andamento",
        icon: "🕐",
        variant: "scheduled" as const,
      }
    }
    return {
      label: "Inativo",
      icon: "📦",
      variant: "default" as const,
    }
  }

  const getUsagePercentage = () => {
    return Math.round((pkg.usedSessions / pkg.totalSessions) * 100)
  }

  const status = getPackageStatus()
  const usagePercentage = getUsagePercentage()

  return (
    <View className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      {/* Header */}
      <View className="mb-3">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-lg font-semibold text-gray-900 flex-1">
            {pkg.name || "Pacote sem nome"}
          </Text>
          <Badge variant={status.variant}>
            {status.icon} {status.label}
          </Badge>
        </View>
        {pkg.description && (
          <Text className="text-sm text-gray-600">{pkg.description}</Text>
        )}
      </View>

      {/* Progress Bar */}
      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm text-gray-700">Progresso de uso</Text>
          <Text className="text-sm font-semibold text-gray-900">
            {usagePercentage}%
          </Text>
        </View>
        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <View
            className={cn(
              "h-full rounded-full",
              usagePercentage === 100 ? "bg-green-500" : "bg-[#fbdd65]"
            )}
            style={{ width: `${usagePercentage}%` }}
          />
        </View>
      </View>

      {/* Statistics Grid */}
      <View className="flex-row gap-3 mb-3">
        <View className="flex-1 bg-gray-50 p-3 rounded-lg">
          <Text className="text-xs text-gray-600 mb-1">Serviços usados</Text>
          <Text className="text-xl font-bold text-gray-900">
            {pkg.usedSessions}
          </Text>
        </View>
        <View className="flex-1 bg-gray-50 p-3 rounded-lg">
          <Text className="text-xs text-gray-600 mb-1">Serviços restantes</Text>
          <Text className="text-xl font-bold text-gray-900">
            {pkg.remainingSessions}
          </Text>
        </View>
      </View>

      {/* Total Services */}
      <View className="bg-gray-50 p-3 rounded-lg mb-3">
        <Text className="text-xs text-gray-600 mb-1">Total de serviços</Text>
        <Text className="text-xl font-bold text-gray-900">
          {pkg.totalSessions}
        </Text>
      </View>

      {/* Payment Status */}
      <View className="border-t border-gray-200 pt-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-gray-700">Status do pagamento</Text>
          <Badge variant={pkg.paid ? "completed" : "canceled"}>
            {pkg.paid ? "✓ Pago" : "⚠ Pendente"}
          </Badge>
        </View>
      </View>
    </View>
  )
}
