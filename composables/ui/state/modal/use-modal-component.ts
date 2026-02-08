import { computed } from 'vue'
import ErrorModal from '~/components/modals/error/ErrorModal.vue'
import Options from '~/components/modals/options/Options.vue'
import EmailReminders from '~/components/modals/reminders/EmailReminders.vue'
import Share from '~/components/modals/share/ShareModal.vue'
import GlobalStats from '~/components/modals/stats/GlobalStats.vue'
import GameTutorial from '~/components/modals/tutorial/GameTutorial.vue'

/**
 * Resolves the currently active modal component.
 * It watches the UI store's `activeModal` state and returns the
 * corresponding Vue component to be rendered in the ModalManager.
 */
export function useModalState() {
  const uiStore = useUiStore()

  const currentModalComponent = computed(() => {
    switch (uiStore.activeModal) {
      case 'emailReminder':
        return EmailReminders
      case 'share':
        return Share
      case 'options':
        return Options
      case 'globalStats':
        return GlobalStats
      case 'gameTutorial':
        return GameTutorial
      case 'rateLimit':
      case 'serviceUnavailable':
      case 'sharedPuzzleNotFound':
        return ErrorModal
      default:
        return ErrorModal
    }
  })

  return { currentModalComponent }
}
