import { useState, useEffect } from "react"
import {
  TextInput,
  View,
  Text,
  Platform,
  Pressable,
  Modal,
  type TextInputProps,
} from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { cn } from "@/utils/cn"

type TimeInputProps = {
  value: string
  onChangeTime: (time: string) => void
  label?: string
  placeholder?: string
} & Omit<TextInputProps, "value" | "onChangeText">

export function TimeInput({
  value,
  onChangeTime,
  label,
  placeholder = "00:00",
  className,
  ...props
}: TimeInputProps) {
  const [showPicker, setShowPicker] = useState(false)
  const [tempDate, setTempDate] = useState(() => {
    if (value?.includes(":")) {
      const [hours, minutes] = value.split(":").map(Number)
      if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
        const date = new Date()
        date.setHours(hours, minutes, 0, 0)
        return date
      }
    }
    return new Date()
  })

  useEffect(() => {
    if (value?.includes(":")) {
      const [hours, minutes] = value.split(":").map(Number)
      if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
        const date = new Date()
        date.setHours(hours, minutes, 0, 0)
        setTempDate(date)
      }
    }
  }, [value])

  const handleChange = (text: string) => {
    const numbers = text.replace(/\D/g, "")

    if (numbers.length === 0) {
      onChangeTime("")
      return
    }

    let formatted = ""
    if (numbers.length <= 2) {
      formatted = numbers
    } else if (numbers.length <= 4) {
      formatted = `${numbers.slice(0, 2)}:${numbers.slice(2)}`
    } else {
      formatted = `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}`
    }

    onChangeTime(formatted)
  }

  const handlePickerChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false)
    }

    if (selectedDate) {
      setTempDate(selectedDate)
      const hours = selectedDate.getHours().toString().padStart(2, "0")
      const minutes = selectedDate.getMinutes().toString().padStart(2, "0")
      onChangeTime(`${hours}:${minutes}`)
    }
  }

  const handleIOSConfirm = () => {
    setShowPicker(false)
    const hours = tempDate.getHours().toString().padStart(2, "0")
    const minutes = tempDate.getMinutes().toString().padStart(2, "0")
    onChangeTime(`${hours}:${minutes}`)
  }

  return (
    <View className="gap-1">
      {label && <Text className="text-sm font-medium">{label}</Text>}

      <View>
        <TextInput
          className={cn(
            "h-16 rounded-md border-2 border-gray-300 bg-white text-black px-4 py-5 text-base",
            "placeholder:text-gray-400",
            props.editable === false && "opacity-50",
            className
          )}
          placeholderTextColor="#9CA3AF"
          selectionColor="black"
          textAlignVertical="center"
          value={value}
          onChangeText={handleChange}
          placeholder={placeholder}
          keyboardType="numeric"
          maxLength={5}
          onFocus={() => {
            if (Platform.OS !== "web") {
              setShowPicker(true)
            }
          }}
          {...props}
        />
      </View>

      {showPicker && Platform.OS === "ios" && (
        <Modal transparent animationType="slide">
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl p-4">
              <View className="flex-row justify-between items-center mb-4">
                <Pressable onPress={() => setShowPicker(false)}>
                  <Text className="text-base text-gray-500">Cancelar</Text>
                </Pressable>
                <Text className="text-base font-semibold">
                  Selecionar horário
                </Text>
                <Pressable onPress={handleIOSConfirm}>
                  <Text className="text-base font-semibold text-black">
                    Confirmar
                  </Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="time"
                is24Hour
                display="spinner"
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
          mode="time"
          is24Hour
          display="default"
          onChange={handlePickerChange}
        />
      )}
    </View>
  )
}
