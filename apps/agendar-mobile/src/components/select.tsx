import { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from "react-native"
import { ChevronDown, Check } from "lucide-react-native"
import { cn } from "@/utils/cn"

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder = "Selecione...",
  disabled = false,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find(opt => opt.value === value)

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue)
    setIsOpen(false)
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className={cn(
          "h-16 rounded-md border-2 border-gray-300 bg-white px-4 flex-row items-center justify-between",
          disabled && "bg-gray-100 opacity-50",
          className
        )}
      >
        <Text
          className={cn(
            "text-base",
            selectedOption ? "text-black" : "text-gray-400"
          )}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <ChevronDown size={20} color="#6B7280" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsOpen(false)}
      >
        <View className="flex-1 justify-end">
          <Pressable
            className="absolute inset-0 bg-black/50"
            onPress={() => setIsOpen(false)}
          />
          <View className="bg-white rounded-t-3xl" style={{ maxHeight: "70%" }}>
            {/* Header */}
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold text-center">
                {placeholder}
              </Text>
            </View>

            {/* Options */}
            <ScrollView>
              {options.map(option => {
                const isSelected = option.value === value
                return (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => handleSelect(option.value)}
                    className={cn(
                      "px-4 py-4 border-b border-gray-100 flex-row items-center justify-between",
                      isSelected && "bg-blue-50"
                    )}
                  >
                    <Text
                      className={cn(
                        "text-base",
                        isSelected
                          ? "text-blue-600 font-semibold"
                          : "text-gray-700"
                      )}
                    >
                      {option.label}
                    </Text>
                    {isSelected && <Check size={20} color="#2563eb" />}
                  </TouchableOpacity>
                )
              })}
            </ScrollView>

            {/* Cancel Button */}
            <View className="p-4 border-t border-gray-200">
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                className="bg-gray-100 py-3 rounded-lg items-center"
              >
                <Text className="text-gray-700 font-semibold">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}
