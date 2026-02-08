import { URL_QUERY_PARAMS } from '~/constants/app/routing'

/**
 * Checks for a shared puzzle link (`?puzzleDate=...`) in the URL on app load.
 * If a valid date is found, it starts an archive game for that puzzle.
 * If the date is invalid, it shows a "not found" modal.
 */
export function useSharedPuzzle() {
  const route = useRoute()
  const gameStore = useGameStore()
  const uiStore = useUiStore()

  const handleSharedPuzzleLink = () => {
    const dateFromUrl = route.query[URL_QUERY_PARAMS.PUZZLE_DATE]

    if (typeof dateFromUrl === 'string') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateFromUrl)) {
        gameStore.startArchiveGame(dateFromUrl)
      }
      else {
        uiStore.showModal('sharedPuzzleNotFound')
      }

      nextTick(() => {
        window.history.replaceState(null, '', window.location.pathname)
      })
    }
  }

  return { handleSharedPuzzleLink }
}
