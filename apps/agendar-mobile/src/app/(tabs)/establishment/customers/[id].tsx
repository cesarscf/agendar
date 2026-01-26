import { useState } from "react"
import { useLocalSearchParams } from "expo-router"
import { View, Text, Pressable } from "react-native"

import { EditCustomerForm } from "@/components/forms/edit-customer-form"
import { CustomerPackages } from "@/components/customer-packages"
import { CustomerLoyaltyPrograms } from "@/components/customer-loyalty-programs"
import { useCustomer } from "@/hooks/data/customers/use-customer"
import { cn } from "@/utils/cn"

export default function EditServiceScreen() {
  const { id } = useLocalSearchParams()
  const customerId = Array.isArray(id) ? id[0] : (id as string)
  const [activeTab, setActiveTab] = useState<
    "general" | "packages" | "loyalty"
  >("general")

  if (!customerId) return null

  const { data: customer, isLoading } = useCustomer(customerId)

  if (isLoading || !customer) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Carregando...</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-white">
      <View className="border-b border-gray-200 bg-white">
        <View className="flex-row p-2">
          <Pressable
            onPress={() => setActiveTab("general")}
            className={cn(
              "flex-1 py-3 rounded-lg mx-1",
              activeTab === "general" ? "bg-[#fbdd65]" : "bg-gray-100"
            )}
          >
            <Text
              className={cn(
                "text-center font-semibold",
                activeTab === "general" ? "text-black" : "text-gray-600"
              )}
            >
              Geral
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("packages")}
            className={cn(
              "flex-1 py-3 rounded-lg mx-1",
              activeTab === "packages" ? "bg-[#fbdd65]" : "bg-gray-100"
            )}
          >
            <Text
              className={cn(
                "text-center font-semibold",
                activeTab === "packages" ? "text-black" : "text-gray-600"
              )}
            >
              Pacotes
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("loyalty")}
            className={cn(
              "flex-1 py-3 rounded-lg mx-1",
              activeTab === "loyalty" ? "bg-[#fbdd65]" : "bg-gray-100"
            )}
          >
            <Text
              className={cn(
                "text-center font-semibold",
                activeTab === "loyalty" ? "text-black" : "text-gray-600"
              )}
            >
              Fidelidade
            </Text>
          </Pressable>
        </View>
      </View>

      {activeTab === "general" && <EditCustomerForm customer={customer} />}
      {activeTab === "packages" && <CustomerPackages customerId={customerId} />}
      {activeTab === "loyalty" && (
        <CustomerLoyaltyPrograms customerPhone={customer.phoneNumber} />
      )}
    </View>
  )
}
