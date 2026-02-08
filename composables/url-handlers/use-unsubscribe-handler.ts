import { URL_QUERY_PARAMS } from '~/constants/app/routing'

/**
 * Checks for an unsubscribe ID in the URL query on app load.
 * If found, it initializes the unsubscribe store and switches the view.
 */
export function useUnsubscribeHandler() {
  const route = useRoute()
  const uiStore = useUiStore()
  const unsubscribeStore = useUnsubscribeStore()

  function handleUnsubscribeLink() {
    const unsubscribeId = route.query[URL_QUERY_PARAMS.UNSUBSCRIBE_ID]

    if (typeof unsubscribeId === 'string') {
      unsubscribeStore.setId(unsubscribeId)
      uiStore.setView('unsubscribe')
      nextTick(() => {
        window.history.replaceState(null!, '', window.location.pathname)
      })
    }
  }

  return { handleUnsubscribeLink }
}
