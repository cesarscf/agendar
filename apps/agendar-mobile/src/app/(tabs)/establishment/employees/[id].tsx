import { useState } from "react"
import { useLocalSearchParams } from "expo-router"
import { View, Text, Pressable } from "react-native"
import { useEmployee } from "@/hooks/data/employees"
import { cn } from "@/utils/cn"
import { EditEmployeeForm } from "@/components/forms/update-employee-form"
import { EmployeeBlocksTab } from "../../../../components/forms/blocks"
import { UpdateEmployeeServiceForm } from "@/components/forms/update-employee-service-form"

export default function EmployeeDetailScreen() {
  const { id } = useLocalSearchParams()
  const employeeId = Array.isArray(id) ? id[0] : (id as string)
  const [activeTab, setActiveTab] = useState<"general" | "blocks" | "services">(
    "general"
  )

  if (!employeeId) return null

  const { data: employee, isLoading } = useEmployee(employeeId)

  if (isLoading || !employee) {
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
            onPress={() => setActiveTab("services")}
            className={cn(
              "flex-1 py-3 rounded-lg mx-1",
              activeTab === "services" ? "bg-[#fbdd65]" : "bg-gray-100"
            )}
          >
            <Text
              className={cn(
                "text-center font-semibold",
                activeTab === "services" ? "text-black" : "text-gray-600"
              )}
            >
              Serviços
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("blocks")}
            className={cn(
              "flex-1 py-3 rounded-lg mx-1",
              activeTab === "blocks" ? "bg-[#fbdd65]" : "bg-gray-100"
            )}
          >
            <Text
              className={cn(
                "text-center font-semibold",
                activeTab === "blocks" ? "text-black" : "text-gray-600"
              )}
            >
              Bloqueios
            </Text>
          </Pressable>
        </View>
      </View>

      {activeTab === "general" && <EditEmployeeForm employee={employee} />}
      {activeTab === "blocks" && <EmployeeBlocksTab employeeId={employeeId} />}
      {activeTab === "services" && (
        <UpdateEmployeeServiceForm employee={employee} />
      )}
    </View>
  )
}
