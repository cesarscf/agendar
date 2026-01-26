import { useMutation } from "@tanstack/react-query"
import React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { updateEstablishmentAvailability } from "@/http/establishment/update-establishment-availability"
import { convertLocalTimeToUTC, convertUTCToLocalTime } from "@/lib/utils"
import type { Availability } from "@/lib/validations/availability"
import { DayAvailabilityCard } from "./day-availability-card"

interface UpdateAvailabilityFormProps {
  availabilities: Availability[]
}

export function UpdateAvailabilityForm({
  availabilities,
}: UpdateAvailabilityFormProps) {
  const getInitialAvailability = React.useCallback(
    (weekday: number): Availability => {
      const existing = availabilities.find(a => a.weekday === weekday)

      if (existing) {
        return {
          ...existing,
          opensAt: convertUTCToLocalTime(existing.opensAt),
          closesAt: convertUTCToLocalTime(existing.closesAt),
          breakStart: convertUTCToLocalTime(existing.breakStart || ""),
          breakEnd: convertUTCToLocalTime(existing.breakEnd || ""),
        }
      }

      return {
        id: "",
        weekday,
        opensAt: "",
        closesAt: "",
        breakStart: "",
        breakEnd: "",
      }
    },
    [availabilities]
  )

  const [sunday, setSunday] = React.useState<Availability>(
    getInitialAvailability(0)
  )
  const [monday, setMonday] = React.useState<Availability>(
    getInitialAvailability(1)
  )
  const [tuesday, setTuesday] = React.useState<Availability>(
    getInitialAvailability(2)
  )
  const [wednesday, setWednesday] = React.useState<Availability>(
    getInitialAvailability(3)
  )
  const [thursday, setThursday] = React.useState<Availability>(
    getInitialAvailability(4)
  )
  const [friday, setFriday] = React.useState<Availability>(
    getInitialAvailability(5)
  )
  const [saturday, setSaturday] = React.useState<Availability>(
    getInitialAvailability(6)
  )

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateEstablishmentAvailability,
    onSuccess: () => {
      toast.success("Horários salvos com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao salvar horários")
    },
  })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    const allAvailabilities = [
      sunday,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
    ]

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

    await mutateAsync({ availability: activeAvailabilities })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-3xl">
      <DayAvailabilityCard
        weekdayLabel="Domingo"
        availability={sunday}
        onUpdate={setSunday}
      />
      <DayAvailabilityCard
        weekdayLabel="Segunda-feira"
        availability={monday}
        onUpdate={setMonday}
      />
      <DayAvailabilityCard
        weekdayLabel="Terça-feira"
        availability={tuesday}
        onUpdate={setTuesday}
      />
      <DayAvailabilityCard
        weekdayLabel="Quarta-feira"
        availability={wednesday}
        onUpdate={setWednesday}
      />
      <DayAvailabilityCard
        weekdayLabel="Quinta-feira"
        availability={thursday}
        onUpdate={setThursday}
      />
      <DayAvailabilityCard
        weekdayLabel="Sexta-feira"
        availability={friday}
        onUpdate={setFriday}
      />
      <DayAvailabilityCard
        weekdayLabel="Sábado"
        availability={saturday}
        onUpdate={setSaturday}
      />

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isPending} className="min-w-32">
          {isPending ? "Salvando..." : "Salvar Horários"}
        </Button>
      </div>
    </form>
  )
}
