import { View, Text, ActivityIndicator, ScrollView } from "react-native"
import { useMemo } from "react"

type HorizontalBarData = {
  label: string
  value: number
  formattedValue: string
}

type HorizontalBarChartProps = {
  title: string
  data: HorizontalBarData[]
  isLoading?: boolean
}

export function HorizontalBarChart({
  title,
  data,
  isLoading,
}: HorizontalBarChartProps) {
  const maxValue = useMemo(() => {
    if (!data.length) return 0
    return Math.max(...data.map(item => item.value))
  }, [data])

  if (isLoading) {
    return (
      <View className="bg-white rounded-xl p-4 border border-gray-200 items-center justify-center min-h-[300px]">
        <ActivityIndicator size="large" color="#000" />
        <Text className="text-sm text-gray-500 mt-2">Carregando...</Text>
      </View>
    )
  }

  if (!data.length) {
    return (
      <View className="bg-white rounded-xl p-4 border border-gray-200">
        <Text className="text-base font-semibold mb-2">{title}</Text>
        <View className="items-center justify-center py-12">
          <Text className="text-sm text-gray-500">Nenhum dado disponível</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="bg-white rounded-xl p-4 border border-gray-200">
      <Text className="text-base font-semibold text-gray-800 mb-4">
        {title}
      </Text>

      <ScrollView className="max-h-[400px]">
        {data.map(item => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0

          return (
            <View key={item.label} className="mb-4">
              <View className="flex-row justify-between items-center mb-1">
                <Text
                  className="text-sm text-gray-700 flex-1"
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
                <Text className="text-sm font-semibold text-black ml-2">
                  {item.formattedValue}
                </Text>
              </View>
              <View className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                {item.value > 0 && (
                  <View
                    className="h-full bg-[#3B82F6] rounded-lg"
                    style={{ width: `${Math.max(percentage, 5)}%` }}
                  />
                )}
              </View>
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}
