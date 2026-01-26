import { startOfMonth, endOfMonth } from "date-fns"

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function formatDate(value: string) {
  const onlyDigits = value.replace(/\D/g, "")
  if (onlyDigits.length <= 2) return onlyDigits
  if (onlyDigits.length <= 4)
    return `${onlyDigits.slice(0, 2)}/${onlyDigits.slice(2)}`
  return (
    onlyDigits.slice(0, 2) +
    "/" +
    onlyDigits.slice(2, 4) +
    "/" +
    onlyDigits.slice(4, 8)
  )
}

export function parseDateFromString(value: string): Date | undefined {
  const parts = value.split("/")
  if (parts.length !== 3) return undefined
  const day = Number(parts[0])
  const month = Number(parts[1]) - 1
  const year = Number(parts[2])
  const date = new Date(year, month, day)
  if (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day
  ) {
    return date
  }
  return undefined
}

export function formatDateToString(date?: Date | null): string {
  if (!date) return ""
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export function formatPhoneNumber(value: string) {
  const onlyDigits = value.replace(/\D/g, "")

  if (onlyDigits.length === 0) return ""

  if (onlyDigits.length <= 2) {
    return `(${onlyDigits}`
  }

  if (onlyDigits.length <= 7) {
    return `(${onlyDigits.slice(0, 2)}) ${onlyDigits.slice(2)}`
  }

  if (onlyDigits.length <= 11) {
    return `(${onlyDigits.slice(0, 2)}) ${onlyDigits.slice(2, 7)}-${onlyDigits.slice(7)}`
  }

  return `(${onlyDigits.slice(0, 2)}) ${onlyDigits.slice(2, 7)}-${onlyDigits.slice(7, 11)}`
}

import { AxiosError } from "axios"

interface ApiErrorResult {
  error: string
}

export function handleApiError(err: unknown): ApiErrorResult {
  if (err instanceof AxiosError) {
    const message =
      err.response?.data?.message ?? "Erro inesperado no servidor."

    return {
      error: message,
    }
  }

  return {
    error: "Erro desconhecido. Tente novamente mais tarde.",
  }
}

export function getCurrentMonthRange() {
  const now = new Date()

  const startDate = startOfMonth(now).toISOString()
  const endDate = endOfMonth(now).toISOString()

  return { startDate, endDate }
}

export function convertLocalTimeToUTC(time: string): string {
  if (!time) return ""

  const [hours, minutes] = time.split(":").map(Number)

  const localDate = new Date()
  localDate.setHours(hours, minutes, 0, 0)

  const utcHours = localDate.getUTCHours().toString().padStart(2, "0")
  const utcMinutes = localDate.getUTCMinutes().toString().padStart(2, "0")

  return `${utcHours}:${utcMinutes}`
}

export function convertUTCToLocalTime(time: string): string {
  if (!time) return ""

  const [hours, minutes] = time.split(":").map(Number)

  const utcDate = new Date()
  utcDate.setUTCHours(hours, minutes, 0, 0)

  const localHours = utcDate.getHours().toString().padStart(2, "0")
  const localMinutes = utcDate.getMinutes().toString().padStart(2, "0")

  return `${localHours}:${localMinutes}`
}

export function convertLocalDateToUTC(localDate: Date): string {
  return localDate.toISOString()
}

export function convertUTCStringToLocalDate(utcString: string): Date {
  return new Date(utcString)
}

export const weekdays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
]

export function formatPriceFromCents(valueInCents: number): string {
  const valueInReais = valueInCents / 100
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valueInReais)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value)
}
