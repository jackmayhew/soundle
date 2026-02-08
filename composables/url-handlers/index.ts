import { useSharedPuzzle } from './use-handle-shared-puzzle'
import { useLegalLinkHandler } from './use-legal-link-handler'
import { useUnsubscribeHandler } from './use-unsubscribe-handler'

/**
 * Orchestrator that initializes all URL-based side effect handlers.
 * Ccalled once in the main app component's onMounted hook.
 * It checks for shared puzzle links, unsubscribe links, and other special URL parameters.
 */
export function useUrlHandlers() {
  const { handleSharedPuzzleLink } = useSharedPuzzle()
  const { handleLegalLink } = useLegalLinkHandler()
  const { handleUnsubscribeLink } = useUnsubscribeHandler()

  /**
   * Runs all URL handlers in a sequence.
   */
  function initializeUrlHandlers() {
    handleSharedPuzzleLink()
    handleLegalLink()
    handleUnsubscribeLink()
  }

  return { initializeUrlHandlers }
}
