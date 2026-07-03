import type { ViewType } from '~/types/ui/ui.types'
import { URL_QUERY_PARAMS } from '~/constants/app/routing'

export function useLegalLinkHandler() {
  const route = useRoute()
  const uiStore = useUiStore()
  const LEGAL_VIEWS = ['privacy', 'terms']

  function handleLegalLink() {
    const legalView = route.query[URL_QUERY_PARAMS.LEGAL_VIEW]

    if (typeof legalView === 'string') {
      if (LEGAL_VIEWS.includes(legalView)) {
        uiStore.setView(legalView as ViewType)

        nextTick(() => {
          window.history.replaceState(null, '', '/')
        })
      }
    }
  }

  return { handleLegalLink }
}
