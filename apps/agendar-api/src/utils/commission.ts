/**
 * Utilities for handling commission values
 *
 * Commission is stored in the database as a decimal (e.g., 0.15 = 15%)
 * and sent/received from the front-end as a percentage string (e.g., "15" = 15%)
 */

/**
 * Converts commission from front-end format (percentage string) to database format (decimal)
 * @param value - Commission as percentage string (e.g., "15" = 15%)
 * @returns Commission as decimal string (e.g., "0.15")
 * @example
 * commissionToDb("25") // "0.25"
 * commissionToDb("25.5") // "0.255"
 * commissionToDb("invalid") // "0.00"
 */
export function commissionToDb(value: string): string {
  const num = Number(value)
  if (Number.isNaN(num)) return "0.00"
  return String(num / 100)
}

/**
 * Converts commission from database format (decimal) to front-end format (percentage string)
 * @param value - Commission as decimal (e.g., 0.15 or "0.15" = 15%)
 * @returns Commission as percentage string (e.g., "15")
 * @example
 * commissionToFront(0.25) // "25"
 * commissionToFront("0.255") // "25.5"
 * commissionToFront("invalid") // "0"
 */
export function commissionToFront(value: number | string): string {
  const num = typeof value === "string" ? Number(value) : value
  if (Number.isNaN(num)) return "0"
  const percentage = num * 100
  // Remove trailing zeros after decimal point
  return percentage % 1 === 0
    ? String(Math.round(percentage))
    : String(percentage)
}
