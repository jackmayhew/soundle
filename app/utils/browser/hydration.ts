import { persistentStorage } from '~/utils/browser/storage'

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
