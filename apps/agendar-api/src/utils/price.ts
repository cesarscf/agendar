/**
 * Utilities for handling price conversions
 *
 * Prices are stored in the database as decimal strings (e.g., "10.50" = R$ 10,50)
 * and sent/received from the front-end as cents strings (e.g., "1050" = R$ 10,50)
 */

/**
 * Converts price from front-end format (cents string) to database format (reais decimal)
 * @param cents - Price in cents as string (e.g., "1050" = R$ 10,50)
 * @returns Price in reais as decimal string (e.g., "10.50")
 * @example
 * centsToReais("1050") // "10.50"
 * centsToReais("999") // "9.99"
 */
export function centsToReais(cents: string): string {
  const value = Number(cents)
  return (value / 100).toFixed(2)
}

/**
 * Converts price from database format (reais decimal) to front-end format (cents string)
 * @param reais - Price in reais as string or number (e.g., "10.50" or 10.50 = R$ 10,50)
 * @returns Price in cents as string (e.g., "1050")
 * @example
 * reaisToCents("10.50") // "1050"
 * reaisToCents(10.50) // "1050"
 * reaisToCents("9.99") // "999"
 */
export function reaisToCents(reais: string | number): string {
  const value = typeof reais === "string" ? Number.parseFloat(reais) : reais
  return String(Math.round(value * 100))
}
