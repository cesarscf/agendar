import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BookingCalendarProps {
  selected: Date | undefined
  onSelect: (date: Date | undefined) => void
  defaultMonth?: Date
  disabled?: (date: Date) => boolean
  className?: string
}

const WEEKDAYS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"]

export function BookingCalendar({
  selected,
  onSelect,
  defaultMonth,
  disabled,
  className,
}: BookingCalendarProps) {
  const [month, setMonth] = useState<Date>(
    startOfMonth(selected ?? defaultMonth ?? new Date())
  )

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { locale: ptBR })
    const end = endOfWeek(endOfMonth(month), { locale: ptBR })
    return eachDayOfInterval({ start, end })
  }, [month])

  // Não permite voltar para meses cujos dias já passaram totalmente.
  const canGoPrevious =
    !isSameMonth(month, new Date()) &&
    startOfMonth(month) > startOfMonth(new Date())

  return (
    <div className={cn("w-full select-none", className)}>
      {/* Cabeçalho: mês/ano + navegação */}
      <div className="mb-4 flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-9 rounded-full shadow-none disabled:opacity-30"
          disabled={!canGoPrevious}
          onClick={() => setMonth(prev => subMonths(prev, 1))}
          aria-label="Mês anterior"
        >
          <ChevronLeftIcon className="size-4" />
        </Button>

        <div className="text-center">
          <p className="text-base font-semibold capitalize leading-none">
            {format(month, "MMMM", { locale: ptBR })}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {format(month, "yyyy")}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-9 rounded-full shadow-none"
          onClick={() => setMonth(prev => addMonths(prev, 1))}
          aria-label="Próximo mês"
        >
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>

      {/* Dias da semana */}
      <div className="mb-1 grid grid-cols-7">
        {WEEKDAYS.map(weekday => (
          <div
            key={weekday}
            className="py-1 text-center text-xs font-medium text-muted-foreground"
          >
            {weekday}
          </div>
        ))}
      </div>

      {/* Grade de dias */}
      <div className="grid grid-cols-7 gap-y-1">
        {days.map(day => {
          const isOutside = !isSameMonth(day, month)
          const isDisabled = disabled?.(day) ?? false
          const isSelected = selected ? isSameDay(day, selected) : false
          const today = isToday(day)

          return (
            <div key={day.toISOString()} className="flex justify-center p-0.5">
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => onSelect(day)}
                aria-pressed={isSelected}
                aria-label={format(day, "PPPP", { locale: ptBR })}
                className={cn(
                  "relative flex aspect-square w-full max-w-11 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  isOutside && "text-muted-foreground/40",
                  isDisabled &&
                    "pointer-events-none text-muted-foreground/30 line-through",
                  today &&
                    !isSelected &&
                    "font-semibold text-primary ring-1 ring-inset ring-primary/40",
                  isSelected &&
                    "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground"
                )}
              >
                {format(day, "d")}
                {today && !isSelected && (
                  <span className="absolute bottom-1 size-1 rounded-full bg-primary" />
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
