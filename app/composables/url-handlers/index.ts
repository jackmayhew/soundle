import { useSharedPuzzle } from './use-handle-shared-puzzle'
import { useLegalLinkHandler } from './use-legal-link-handler'
import { useUnsubscribeHandler } from './use-unsubscribe-handler'

export function useUrlHandlers() {
  const { handleSharedPuzzleLink } = useSharedPuzzle()
  const { handleLegalLink } = useLegalLinkHandler()
  const { handleUnsubscribeLink } = useUnsubscribeHandler()

  function initializeUrlHandlers() {
    handleSharedPuzzleLink()
    handleLegalLink()
    handleUnsubscribeLink()
  }

  return { initializeUrlHandlers }
}
