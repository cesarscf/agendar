import { View, Text, Pressable } from "react-native"
import type { Availability } from "@/lib/validations/availability"
import { Switch } from "./switch"
import { TimeInput } from "./time-input"
import { Trash2 } from "lucide-react-native"

interface DayAvailabilityCardProps {
  weekdayLabel: string
  availability: Availability
  onUpdate: (availability: Availability) => void
}

export function DayAvailabilityCard({
  weekdayLabel,
  availability,
  onUpdate,
}: DayAvailabilityCardProps) {
  const isActive = Boolean(availability.opensAt && availability.closesAt)
  const hasBreak = Boolean(availability.breakStart && availability.breakEnd)

  const toggleDayActive = (active: boolean) => {
    if (active) {
      onUpdate({
        ...availability,
        opensAt: availability.opensAt || "09:00",
        closesAt: availability.closesAt || "18:00",
      })
    } else {
      onUpdate({
        ...availability,
        opensAt: "",
        closesAt: "",
        breakStart: "",
        breakEnd: "",
      })
    }
  }

  const toggleBreak = (active: boolean) => {
    if (active) {
      onUpdate({
        ...availability,
        breakStart: availability.breakStart || "12:00",
        breakEnd: availability.breakEnd || "13:00",
      })
    } else {
      onUpdate({
        ...availability,
        breakStart: "",
        breakEnd: "",
      })
    }
  }

  const clearDay = () => {
    onUpdate({
      ...availability,
      opensAt: "",
      closesAt: "",
      breakStart: "",
      breakEnd: "",
    })
  }

  const updateField = (key: keyof Availability, value: string) => {
    onUpdate({
      ...availability,
      [key]: value,
    })
  }

  return (
    <View className="bg-white border-2 border-gray-200 rounded-lg p-4 mb-4">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-3 flex-1">
          <Text className="text-base font-semibold text-black">
            {weekdayLabel}
          </Text>
          <Text className="text-sm text-gray-500">
            {isActive ? "Aberto" : "Fechado"}
          </Text>
        </View>

        <View className="flex-row items-center gap-3">
          {isActive && (
            <Pressable
              onPress={clearDay}
              className="p-2"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Trash2 size={20} color="#ef4444" />
            </Pressable>
          )}
          <Switch value={isActive} onValueChange={toggleDayActive} />
        </View>
      </View>

      {isActive && (
        <View className="gap-4">
          <View className="flex-row gap-3">
            <View className="flex-1">
              <TimeInput
                label="Abre às"
                value={availability.opensAt}
                onChangeTime={value => updateField("opensAt", value)}
                placeholder="09:00"
              />
            </View>

            <View className="flex-1">
              <TimeInput
                label="Fecha às"
                value={availability.closesAt}
                onChangeTime={value => updateField("closesAt", value)}
                placeholder="18:00"
              />
            </View>
          </View>

          <View className="h-px bg-gray-200 my-2" />

          <Switch
            label="Intervalo para almoço"
            value={hasBreak}
            onValueChange={toggleBreak}
          />

          {hasBreak && (
            <View className="flex-row gap-3 mt-2">
              <View className="flex-1">
                <TimeInput
                  label="Início do intervalo"
                  value={availability.breakStart || ""}
                  onChangeTime={value => updateField("breakStart", value)}
                  placeholder="12:00"
                />
              </View>

              <View className="flex-1">
                <TimeInput
                  label="Fim do intervalo"
                  value={availability.breakEnd || ""}
                  onChangeTime={value => updateField("breakEnd", value)}
                  placeholder="13:00"
                />
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  )
}
