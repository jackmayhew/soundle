import DefaultError from '~/components/modals/error/DefaultError.vue'
import RateLimit from '~/components/modals/error/RateLimit.vue'
import ServiceUnavailable from '~/components/modals/error/ServiceUnavailable.vue'
import SharedPuzzleNotFound from '~/components/modals/error/SharedPuzzleNotFound.vue'

/**
 * Resolves the correct error component to display in the ErrorModal.
 * It watches the `uiStore.activeModal` state to determine which specific
 * error condition has been triggered.
 */
export function useErrorComponent() {
  const uiStore = useUiStore()

  const currentErrorComponent = computed(() => {
    switch (uiStore.activeModal) {
      case 'rateLimit':
        return RateLimit
      case 'serviceUnavailable':
        return ServiceUnavailable
      case 'sharedPuzzleNotFound':
        return SharedPuzzleNotFound
      default:
        return DefaultError
    }
  })

  return { currentErrorComponent }
}
