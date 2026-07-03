import { URL_QUERY_PARAMS } from '~/constants/app/routing'

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
