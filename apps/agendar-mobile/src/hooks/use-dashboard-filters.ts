import { useState, useCallback, useEffect } from "react"
import { startOfMonth, endOfMonth, format } from "date-fns"
import AsyncStorage from "@react-native-async-storage/async-storage"

const FILTERS_KEY = "@dashboard:filters"

export function useDashboardFilters() {
  const [startDate, setStartDate] = useState(
    format(startOfMonth(new Date()), "yyyy-MM-dd")
  )
  const [endDate, setEndDate] = useState(
    format(endOfMonth(new Date()), "yyyy-MM-dd")
  )
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
    setStartDate(format(startOfMonth(today), "yyyy-MM-dd"))
    setEndDate(format(endOfMonth(today), "yyyy-MM-dd"))
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
