import { useState, useCallback, useEffect } from "react"
import { startOfDay, endOfDay, format } from "date-fns"
import AsyncStorage from "@react-native-async-storage/async-storage"

const FILTERS_KEY = "@agenda:filters"

export function useAgendaFilters() {
  const today = new Date()
  const [startDate, setStartDate] = useState(
    format(startOfDay(today), "yyyy-MM-dd")
  )
  const [endDate, setEndDate] = useState(format(endOfDay(today), "yyyy-MM-dd"))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    AsyncStorage.getItem(FILTERS_KEY).then((stored: string | null) => {
      if (stored) {
        const { startDate: s, endDate: e } = JSON.parse(stored)
        if (s) setStartDate(s)
        if (e) setEndDate(e)
      }
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(FILTERS_KEY, JSON.stringify({ startDate, endDate }))
    }
  }, [startDate, endDate, isLoading])

  const clearFilters = useCallback(() => {
    const today = new Date()
    setStartDate(format(startOfDay(today), "yyyy-MM-dd"))
    setEndDate(format(endOfDay(today), "yyyy-MM-dd"))
  }, [])

  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    clearFilters,
    isLoading,
  }
}
