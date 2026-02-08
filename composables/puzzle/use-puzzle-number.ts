import { FIRST_PUZZLE_DATE } from '~/constants/game'

/**
 * Reactive composable that calculates the sequential puzzle number
 * based on a given date. The count starts from the `FIRST_PUZZLE_DATE`.
 * @param puzzleDate A ref or getter for the target date string (YYYY-MM-DD).
 */
export function usePuzzleNumber(puzzleDate: MaybeRefOrGetter<string | null>) {
  return computed(() => {
    const date = toValue(puzzleDate)

    if (!date)
      return null

    const startDate = new Date(`${FIRST_PUZZLE_DATE}T12:00:00Z`)
    const todayDate = new Date(`${date}T12:00:00Z`)
    const diffTime = Math.abs(todayDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    return diffDays
  })
}
