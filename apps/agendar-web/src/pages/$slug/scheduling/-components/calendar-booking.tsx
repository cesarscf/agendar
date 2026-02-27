import { useQuery } from "@tanstack/react-query"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { getAvailability } from "@/http/public/get-public-availability"
import { toISODateString } from "@/lib/utils"

interface CalendarBookingProps {
  selectedDate: Date | undefined
  setSelectedDate: (date: Date | undefined) => void
  selectedTime: string | null
  setSelectedTime: (time: string | null) => void
  employeeId: string | null
  serviceId: string | null
  establishmentId: string | null
}

export function CalendarBooking({
  employeeId,
  establishmentId,
  serviceId,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
}: CalendarBookingProps) {
  const { data: rawTimeSlots, isLoading } = useQuery({
    queryKey: [
      "public",
      "time-slots",
      {
        date: selectedDate ? toISODateString(selectedDate) : "",
        employeeId,
        establishmentId,
        serviceId,
      },
    ],
    queryFn: () =>
      getAvailability({
        date: selectedDate ? toISODateString(selectedDate) : "",
        employeeId: employeeId!,
        establishmentId: establishmentId!,
        serviceId: serviceId!,
      }),
    enabled: Boolean(
      selectedDate && employeeId && establishmentId && serviceId
    ),
  })

  const now = new Date()

  const timeSlots = rawTimeSlots
    ?.filter(item => {
      const slotDate = new Date(item)
      return slotDate > now
    })
    .map(item => {
      const date = new Date(item)
      return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    })

  return (
    <div className="space-y-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-0">
          <div className="flex flex-col">
            <div className="flex-1 p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                defaultMonth={selectedDate}
                showOutsideDays={false}
                modifiersClassNames={{
                  booked: "[&>button]:line-through opacity-100",
                }}
                disabled={date =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
                className="bg-transparent p-0 w-full"
                locale={ptBR}
                formatters={{
                  formatWeekdayName: date =>
                    date.toLocaleString("pt-BR", { weekday: "short" }),
                }}
              />
            </div>

            <div className="w-full border-t">
              <div className="p-4">
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {isLoading && (
                    <div className="col-span-5 text-sm text-muted-foreground text-center">
                      Carregando horários...
                    </div>
                  )}
                  {!isLoading && timeSlots?.length === 0 && (
                    <div className="col-span-5 text-sm text-muted-foreground text-center">
                      Nenhum horário disponível
                    </div>
                  )}
                  {timeSlots?.map(time => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => setSelectedTime(time)}
                      className="shadow-none"
                      size="sm"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-sm text-center pt-4">
        {selectedDate && selectedTime ? (
          <>
            Seu agendamento será para{" "}
            <span className="font-medium">
              {selectedDate.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>{" "}
            às <span className="font-medium">{selectedTime}</span>.
          </>
        ) : (
          "Selecione uma data e horário para seu agendamento."
        )}
      </div>
    </div>
  )
}
