import { FIRST_PUZZLE_DATE } from '~/constants/game'

/**
 * Generates an array of all playable archive dates.
 * It creates a list of date strings in YYYY-MM-DD format, starting from
 * the `FIRST_PUZZLE_DATE` up to and including the current day.
 * @returns An array of date strings, sorted from newest to oldest.
 */
export function useArchiveDates() {
  const dates = []
  const startDate = new Date(`${FIRST_PUZZLE_DATE}T12:00:00Z`)
  const endDate = new Date() // today

  // calculate the difference in days
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // create dates
  for (let i = 0; i <= diffDays; i++) {
    const nextDate = new Date(startDate)
    nextDate.setDate(startDate.getDate() + i)

    const year = nextDate.getFullYear()
    const month = String(nextDate.getMonth() + 1).padStart(2, '0')
    const day = String(nextDate.getDate()).padStart(2, '0')

    // don't go past today
    if (nextDate <= endDate) {
      dates.push(`${year}-${month}-${day}`)
    }
  }

  return dates.reverse()
}
