import ShareGame from '~/components/modals/share/game/ShareGame.vue'
import ShareResult from '~/components/modals/share/results/ShareResult.vue'
import ShareUserStats from '~/components/modals/share/user-stats/ShareUserStats.vue'

/**
 * Resolves the correct content component for the Share Modal.
 * It watches the global `uiStore.view` to determine which type of content
 * the user is currently trying to share (Game, Results, or Stats).
 */
export function useShareComponent() {
  const uiStore = useUiStore()

  const currentShareComponent = computed(() => {
    switch (uiStore.view) {
      case 'results':
        return ShareResult
      case 'game':
        return ShareGame
      case 'userStats':
        return ShareUserStats
      default:
        return null
    }
  })

  return { currentShareComponent }
}
