import { View, Text, ActivityIndicator } from "react-native"
import { PieChart } from "react-native-gifted-charts"

type PieChartData = {
  value: number
  color: string
  text?: string
  label: string
}

type PieChartCardProps = {
  title: string
  data: PieChartData[]
  isLoading?: boolean
  formatValue?: (value: number) => string
}

const CHART_COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#6366F1",
  "#000000",
]

export function PieChartCard({
  title,
  data,
  isLoading,
  formatValue,
}: PieChartCardProps) {
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

  const chartData = data.map((item, index) => ({
    value: item.value,
    color: item.color || CHART_COLORS[index % CHART_COLORS.length],
    text: item.text,
  }))

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <View className="bg-white rounded-xl p-4 border border-gray-200">
      <Text className="text-base font-semibold text-gray-800 mb-4">
        {title}
      </Text>

      <View className="items-center mb-4">
        <PieChart
          data={chartData}
          donut
          radius={80}
          innerRadius={50}
          innerCircleColor="#fff"
          centerLabelComponent={() => (
            <View className="items-center justify-center">
              <Text className="text-xs text-gray-500">Total</Text>
              <Text className="text-lg font-bold">
                {formatValue ? formatValue(total) : total}
              </Text>
            </View>
          )}
        />
      </View>

      <View>
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1)
          return (
            <View
              key={item.label}
              className="flex-row items-center justify-between py-2 border-b border-gray-100"
            >
              <View className="flex-row items-center gap-2 flex-1">
                <View
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      item.color || CHART_COLORS[index % CHART_COLORS.length],
                  }}
                />
                <Text
                  className="text-sm text-gray-700 flex-1"
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </View>
              <View className="items-end ml-2">
                <Text className="text-sm font-semibold text-black">
                  {formatValue ? formatValue(item.value) : item.value}
                </Text>
                <Text className="text-xs text-gray-500">{percentage}%</Text>
              </View>
            </View>
          )
        })}
      </View>
    </View>
  )
}
