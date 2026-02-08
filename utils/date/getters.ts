/**
 * Returns the current date as a string in YYYY-MM-DD format.
 * Uses the user's local timezone.
 */
export function getTodayString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Extracts the four-digit year from a YYYY-MM-DD date string.
 * @param date The date string to parse.
 */
export function getYearFromDate(date: string): string {
  return date.split('-')[0]!
}
