import { useCustomers } from "@/hooks/data/customers/use-customers"
import { Link } from "expo-router"
import { ChevronRight, Phone, Mail, UserX } from "lucide-react-native"
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Pressable,
} from "react-native"
import { Empty } from "@/components/empty"

export default function Customers() {
  const { data: customers, isLoading } = useCustomers()

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    )
  }

  if (!customers || customers.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Empty
          message="Nenhum cliente cadastrado"
          icon={<UserX size={48} color="#9CA3AF" />}
        />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="mt-2 px-4">
          {customers?.map(customer => (
            <Link
              href={`/(tabs)/establishment/customers/${customer.id}`}
              key={customer.id}
              asChild
            >
              <Pressable className="flex-row items-center justify-between p-4 border-b border-gray-200">
                <View className="flex-1">
                  <Text
                    className="text-lg font-semibold text-gray-900 mb-1"
                    numberOfLines={1}
                  >
                    {customer.name}
                  </Text>

                  {customer.phoneNumber ? (
                    <View className="flex-row items-center gap-1 mb-0.5">
                      <Phone size={16} color="#6B7280" />
                      <Text className="text-sm text-gray-600">
                        {customer.phoneNumber}
                      </Text>
                    </View>
                  ) : null}

                  {customer.email ? (
                    <View className="flex-row items-center gap-1">
                      <Mail size={16} color="#6B7280" />
                      <Text className="text-sm text-gray-600" numberOfLines={1}>
                        {customer.email}
                      </Text>
                    </View>
                  ) : null}
                </View>

                <ChevronRight size={20} color="#9CA3AF" />
              </Pressable>
            </Link>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
