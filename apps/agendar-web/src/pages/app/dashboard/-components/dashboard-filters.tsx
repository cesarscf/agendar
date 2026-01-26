import { parseDate } from "@internationalized/date"
import { endOfMonth, startOfMonth } from "date-fns"
import { X } from "lucide-react"
import { parseAsIsoDate, useQueryState } from "nuqs"
import type { DateValue } from "react-aria-components"
import { DatePicker } from "@/components/date-picker"
import { Button } from "@/components/ui/button"

const getCurrentMonthStart = () => startOfMonth(new Date())
const getCurrentMonthEnd = () => endOfMonth(new Date())

export function DashboardFilters() {
  const [startDate, setStartDate] = useQueryState(
    "startDate",
    parseAsIsoDate.withDefault(getCurrentMonthStart())
  )

  const [endDate, setEndDate] = useQueryState(
    "endDate",
    parseAsIsoDate.withDefault(getCurrentMonthEnd())
  )

  const handleStartDateChange = (value: DateValue | null) => {
    if (value) {
      setStartDate(new Date(value.toString()))
    }
  }

  const handleEndDateChange = (value: DateValue | null) => {
    if (value) {
      setEndDate(new Date(value.toString()))
    }
  }

  const handleClearFilters = () => {
    setStartDate(getCurrentMonthStart())
    setEndDate(getCurrentMonthEnd())
  }

  const startDateValue = startDate
    ? parseDate(startDate.toISOString().split("T")[0])
    : undefined

  const endDateValue = endDate
    ? parseDate(endDate.toISOString().split("T")[0])
    : undefined

  return (
    <div className="flex flex-wrap items-end gap-4">
      <DatePicker
        label="Data inicial"
        value={startDateValue}
        onChange={handleStartDateChange}
      />

      <DatePicker
        label="Data final"
        value={endDateValue}
        onChange={handleEndDateChange}
      />

      <Button variant="outline" size="sm" onClick={handleClearFilters}>
        <X className="h-4 w-4 mr-1" />
        Limpar filtros
      </Button>
    </div>
  )
}
