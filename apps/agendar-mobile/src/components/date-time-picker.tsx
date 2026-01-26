import { useState, useEffect } from "react"
import {
  View,
  Text,
  Platform,
  Pressable,
  Modal,
  type TextInputProps,
} from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar } from "lucide-react-native"
import { cn } from "@/utils/cn"

type DateTimePickerInputProps = {
  value: Date | undefined
  onChangeDateTime: (date: Date) => void
  label?: string
  placeholder?: string
} & Omit<TextInputProps, "value" | "onChangeText">

export function DateTimePickerInput({
  value,
  onChangeDateTime,
  label,
  placeholder = "Selecione a data e hora",
  className,
  ...props
}: DateTimePickerInputProps) {
  const [showPicker, setShowPicker] = useState(false)
  const [mode, setMode] = useState<"date" | "time">("date")
  const [tempDate, setTempDate] = useState(value || new Date())

  useEffect(() => {
    if (value) {
      setTempDate(value)
    }
  }, [value])

  const handleChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false)
      if (selectedDate) {
        if (mode === "date") {
          setTempDate(selectedDate)
          setMode("time")
          setShowPicker(true)
        } else {
          onChangeDateTime(selectedDate)
          setMode("date")
        }
      }
    } else if (selectedDate) {
      setTempDate(selectedDate)
    }
  }

  const handleIOSConfirm = () => {
    setShowPicker(false)
    onChangeDateTime(tempDate)
  }

  const displayValue = value
    ? format(value, "dd/MM/yyyy HH:mm", { locale: ptBR })
    : ""

  return (
    <View className="gap-1">
      {label && <Text className="text-sm font-medium">{label}</Text>}

      <Pressable onPress={() => setShowPicker(true)}>
        <View
          className={cn(
            "h-16 rounded-md border-2 border-gray-300 bg-white px-4 flex-row items-center justify-between",
            props.editable === false && "opacity-50",
            className
          )}
        >
          <Text
            className={cn("text-base", value ? "text-black" : "text-gray-400")}
          >
            {displayValue || placeholder}
          </Text>
          <Calendar size={20} color="#6B7280" />
        </View>
      </Pressable>

      {showPicker && Platform.OS === "ios" && (
        <Modal transparent animationType="slide">
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl p-4">
              <View className="flex-row justify-between items-center mb-4">
                <Pressable onPress={() => setShowPicker(false)}>
                  <Text className="text-base text-gray-500">Cancelar</Text>
                </Pressable>
                <Text className="text-base font-semibold">
                  Selecionar data e hora
                </Text>
                <Pressable onPress={handleIOSConfirm}>
                  <Text className="text-base font-semibold text-black">
                    Confirmar
                  </Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="datetime"
                is24Hour
                display="spinner"
                locale="pt-BR"
                onChange={(_event, date) => {
                  if (date) setTempDate(date)
                }}
              />
            </View>
          </View>
        </Modal>
      )}

      {showPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={tempDate}
          mode={mode}
          is24Hour
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  )
}
