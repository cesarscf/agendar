import { useState } from "react"
import { Alert, ScrollView, View } from "react-native"
import type { Availability } from "@/lib/validations/availability"
import { DayAvailabilityCard } from "../day-availability-card"
import { AppButton } from "../button"
import { useUpdateAvailability } from "@/hooks/data/availabilities"
import { convertLocalTimeToUTC, convertUTCToLocalTime } from "@/utils"

interface UpdateAvailabilityFormProps {
  availabilities: Availability[]
}

const WEEKDAYS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
]

export function UpdateAvailabilityForm({
  availabilities,
}: UpdateAvailabilityFormProps) {
  const { mutateAsync, isPending } = useUpdateAvailability()

  // Função para inicializar disponibilidade de um dia
  const getInitialAvailability = (weekday: number): Availability => {
    const existing = availabilities.find(a => a.weekday === weekday)

    if (existing) {
      // Converte horários de UTC para timezone local
      return {
        ...existing,
        opensAt: convertUTCToLocalTime(existing.opensAt),
        closesAt: convertUTCToLocalTime(existing.closesAt),
        breakStart: convertUTCToLocalTime(existing.breakStart || ""),
        breakEnd: convertUTCToLocalTime(existing.breakEnd || ""),
      }
    }

    // Retorna objeto vazio se não existir
    return {
      id: "",
      weekday,
      opensAt: "",
      closesAt: "",
      breakStart: "",
      breakEnd: "",
    }
  }

  // Estados individuais para cada dia
  const [sunday, setSunday] = useState<Availability>(() =>
    getInitialAvailability(0)
  )
  const [monday, setMonday] = useState<Availability>(() =>
    getInitialAvailability(1)
  )
  const [tuesday, setTuesday] = useState<Availability>(() =>
    getInitialAvailability(2)
  )
  const [wednesday, setWednesday] = useState<Availability>(() =>
    getInitialAvailability(3)
  )
  const [thursday, setThursday] = useState<Availability>(() =>
    getInitialAvailability(4)
  )
  const [friday, setFriday] = useState<Availability>(() =>
    getInitialAvailability(5)
  )
  const [saturday, setSaturday] = useState<Availability>(() =>
    getInitialAvailability(6)
  )

  async function onSubmit() {
    const allAvailabilities = [
      sunday,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
    ]

    // Filtra apenas dias ativos (com horários preenchidos)
    const activeAvailabilities = allAvailabilities
      .filter(item => item.opensAt && item.closesAt)
      .map(item => ({
        weekday: item.weekday,
        opensAt: convertLocalTimeToUTC(item.opensAt),
        closesAt: convertLocalTimeToUTC(item.closesAt),
        breakStart: item.breakStart
          ? convertLocalTimeToUTC(item.breakStart)
          : undefined,
        breakEnd: item.breakEnd
          ? convertLocalTimeToUTC(item.breakEnd)
          : undefined,
      }))

    try {
      await mutateAsync({ availability: activeAvailabilities })
      Alert.alert("Sucesso", "Horários salvos com sucesso!")
    } catch {
      Alert.alert("Erro", "Erro ao salvar horários. Tente novamente.")
    }
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 100,
        }}
      >
        <DayAvailabilityCard
          weekdayLabel={WEEKDAYS[0]}
          availability={sunday}
          onUpdate={setSunday}
        />
        <DayAvailabilityCard
          weekdayLabel={WEEKDAYS[1]}
          availability={monday}
          onUpdate={setMonday}
        />
        <DayAvailabilityCard
          weekdayLabel={WEEKDAYS[2]}
          availability={tuesday}
          onUpdate={setTuesday}
        />
        <DayAvailabilityCard
          weekdayLabel={WEEKDAYS[3]}
          availability={wednesday}
          onUpdate={setWednesday}
        />
        <DayAvailabilityCard
          weekdayLabel={WEEKDAYS[4]}
          availability={thursday}
          onUpdate={setThursday}
        />
        <DayAvailabilityCard
          weekdayLabel={WEEKDAYS[5]}
          availability={friday}
          onUpdate={setFriday}
        />
        <DayAvailabilityCard
          weekdayLabel={WEEKDAYS[6]}
          availability={saturday}
          onUpdate={setSaturday}
        />
      </ScrollView>

      {/* Botão fixo no final */}
      <View className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
        <AppButton
          disabled={isPending}
          loading={isPending}
          title="Salvar Horários"
          theme="primary"
          onPress={onSubmit}
        />
      </View>
    </View>
  )
}
