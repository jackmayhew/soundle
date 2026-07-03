import { FIRST_PUZZLE_DATE } from '~/constants/game'

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
