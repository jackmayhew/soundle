import { FIRST_PUZZLE_DATE } from '~/constants/game'

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
