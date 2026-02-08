import localforage from 'localforage'

localforage.config({
  name: 'soundle-db',
  storeName: 'pinia_state',
})

/**
 * Async storage wrapper using localforage (IndexedDB) for data persistence.
 */
export const persistentStorage = {
  async setItem(key: string, value: any): Promise<any> {
    return await localforage.setItem(key, value)
  },

  async getItem(key: string): Promise<any> {
    return await localforage.getItem(key)
  },

  async removeItem(key: string): Promise<void> {
    return await localforage.removeItem(key)
  },
}
