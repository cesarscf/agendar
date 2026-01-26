export function formatCentsToReal(cents: number): string {
  const reais = cents / 100
  return reais.toFixed(2).replace(".", ",")
}

export function formatRealDisplay(value: string): string {
  const cleaned = value.replace(/[^\d,]/g, "")

  const parts = cleaned.split(",")
  let integerPart = parts[0] || ""
  const decimalPart = parts[1]

  if (integerPart.length > 3) {
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  if (decimalPart !== undefined) {
    return `${integerPart},${decimalPart.slice(0, 2)}`
  }
  return integerPart
}

export function parseBRLToCents(value: string): string {
  const normalized = value.replace(/\./g, "").replace(",", ".")

  const amount = Number.parseFloat(normalized)

  if (Number.isNaN(amount)) {
    return "0"
  }

  return String(Math.round(amount * 100))
}

export function formatCurrencyInput(value: string): string {
  const cleaned = value.replace(/\D/g, "")

  if (!cleaned) {
    return "0,00"
  }

  const numberValue = Number.parseInt(cleaned, 10)

  const reais = numberValue / 100

  const formatted = reais.toFixed(2)

  const [integerPart, decimalPart] = formatted.split(".")

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  return `${formattedInteger},${decimalPart}`
}

export function isValidBRLFormat(value: string): boolean {
  const regex = /^(\d{1,3}(\.\d{3})*|\d+)(,\d{1,2})?$/
  return regex.test(value)
}

export function formatPercentageInput(value: string): string {
  let cleaned = value.replace(/[^\d.]/g, "")

  const parts = cleaned.split(".")
  if (parts.length > 2) {
    cleaned = `${parts[0]}.${parts.slice(1).join("")}`
  }

  if (parts.length === 2 && parts[1].length > 2) {
    cleaned = `${parts[0]}.${parts[1].slice(0, 2)}`
  }

  return cleaned
}
