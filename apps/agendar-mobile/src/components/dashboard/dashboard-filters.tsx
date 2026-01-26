import { View, Text, Pressable, Platform, Modal } from "react-native"
import { useState } from "react"
import DateTimePicker from "@react-native-community/datetimepicker"
import { format, parse } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar, X, RefreshCw } from "lucide-react-native"

type DashboardFiltersProps = {
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  onClearFilters: () => void
  onRefresh?: () => void
  isRefreshing?: boolean
}

export function DashboardFilters({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClearFilters,
  onRefresh,
  isRefreshing = false,
}: DashboardFiltersProps) {
  const [showStartPicker, setShowStartPicker] = useState(false)
  const [showEndPicker, setShowEndPicker] = useState(false)
  const [tempStartDate, setTempStartDate] = useState(
    parse(startDate, "yyyy-MM-dd", new Date())
  )
  const [tempEndDate, setTempEndDate] = useState(
    parse(endDate, "yyyy-MM-dd", new Date())
  )

  const handleStartDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowStartPicker(false)
      if (selectedDate) {
        onStartDateChange(format(selectedDate, "yyyy-MM-dd"))
      }
    } else if (selectedDate) {
      setTempStartDate(selectedDate)
    }
  }

  const handleEndDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowEndPicker(false)
      if (selectedDate) {
        onEndDateChange(format(selectedDate, "yyyy-MM-dd"))
      }
    } else if (selectedDate) {
      setTempEndDate(selectedDate)
    }
  }

  const handleIOSStartConfirm = () => {
    setShowStartPicker(false)
    onStartDateChange(format(tempStartDate, "yyyy-MM-dd"))
  }

  const handleIOSEndConfirm = () => {
    setShowEndPicker(false)
    onEndDateChange(format(tempEndDate, "yyyy-MM-dd"))
  }

  return (
    <View className="bg-white p-4 gap-4 border-b border-gray-200">
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Data Início
          </Text>
          <Pressable onPress={() => setShowStartPicker(true)}>
            <View className="h-12 rounded-lg border border-gray-300 bg-white px-3 flex-row items-center justify-between">
              <Text className="text-base">
                {format(
                  parse(startDate, "yyyy-MM-dd", new Date()),
                  "dd/MM/yyyy",
                  {
                    locale: ptBR,
                  }
                )}
              </Text>
              <Calendar size={18} color="#6B7280" />
            </View>
          </Pressable>
        </View>

        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Data Fim
          </Text>
          <Pressable onPress={() => setShowEndPicker(true)}>
            <View className="h-12 rounded-lg border border-gray-300 bg-white px-3 flex-row items-center justify-between">
              <Text className="text-base">
                {format(
                  parse(endDate, "yyyy-MM-dd", new Date()),
                  "dd/MM/yyyy",
                  {
                    locale: ptBR,
                  }
                )}
              </Text>
              <Calendar size={18} color="#6B7280" />
            </View>
          </Pressable>
        </View>
      </View>

      <View className="flex-row gap-3">
        <Pressable
          onPress={onClearFilters}
          className="flex-1 flex-row items-center justify-center gap-2 h-10 rounded-lg border border-gray-300 bg-gray-50"
        >
          <X size={16} color="#6B7280" />
          <Text className="text-sm font-medium text-gray-700">
            Limpar Filtros
          </Text>
        </Pressable>

        {onRefresh && (
          <Pressable
            onPress={onRefresh}
            disabled={isRefreshing}
            className="flex-1 flex-row items-center justify-center gap-2 h-10 rounded-lg border border-gray-300 bg-gray-50"
          >
            <RefreshCw size={16} color={isRefreshing ? "#9CA3AF" : "#6B7280"} />
            <Text
              className={`text-sm font-medium ${isRefreshing ? "text-gray-400" : "text-gray-700"}`}
            >
              Atualizar
            </Text>
          </Pressable>
        )}
      </View>

      {showStartPicker && Platform.OS === "ios" && (
        <Modal transparent animationType="slide">
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl p-4">
              <View className="flex-row justify-between items-center mb-4">
                <Pressable onPress={() => setShowStartPicker(false)}>
                  <Text className="text-base text-gray-500">Cancelar</Text>
                </Pressable>
                <Text className="text-base font-semibold">
                  Selecionar data início
                </Text>
                <Pressable onPress={handleIOSStartConfirm}>
                  <Text className="text-base font-semibold text-black">
                    Confirmar
                  </Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={tempStartDate}
                mode="date"
                display="spinner"
                locale="pt-BR"
                onChange={(_event, date) => {
                  if (date) setTempStartDate(date)
                }}
              />
            </View>
          </View>
        </Modal>
      )}

      {showStartPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={parse(startDate, "yyyy-MM-dd", new Date())}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      {showEndPicker && Platform.OS === "ios" && (
        <Modal transparent animationType="slide">
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl p-4">
              <View className="flex-row justify-between items-center mb-4">
                <Pressable onPress={() => setShowEndPicker(false)}>
                  <Text className="text-base text-gray-500">Cancelar</Text>
                </Pressable>
                <Text className="text-base font-semibold">
                  Selecionar data fim
                </Text>
                <Pressable onPress={handleIOSEndConfirm}>
                  <Text className="text-base font-semibold text-black">
                    Confirmar
                  </Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={tempEndDate}
                mode="date"
                display="spinner"
                locale="pt-BR"
                onChange={(_event, date) => {
                  if (date) setTempEndDate(date)
                }}
              />
            </View>
          </View>
        </Modal>
      )}

      {showEndPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={parse(endDate, "yyyy-MM-dd", new Date())}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}
    </View>
  )
}
