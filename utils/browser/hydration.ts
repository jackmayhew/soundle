import { persistentStorage } from '~/utils/browser/storage'

/**
 * Fetches and parses persisted state for a specific store from async storage.
 * @param storeId - The unique key of the store (e.g., 'game', 'stats').
 * @returns The parsed state object or null if no data exists.
 */
export async function getHydratedState<T>(storeId: string): Promise<T | null> {
  if (!import.meta.client)
    return null

  try {
    const persistedState = await persistentStorage.getItem(storeId)
    if (persistedState) {
      return JSON.parse(persistedState as string) as T
    }
  }
  catch (error) {
    console.error(`Failed to hydrate store: ${storeId}`, error)
  }

  return null
}
