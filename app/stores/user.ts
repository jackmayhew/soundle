import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { persistentStorage } from '~/utils/browser/storage'

export const useUserStore = defineStore('user', {
  state: () => ({
    anonymousId: '',
    hasPlayedBefore: false,
  }),

  actions: {
    initializeAnonymousId() {
      if (!this.anonymousId) {
        this.anonymousId = uuidv4()
      }
      const { $posthog } = useNuxtApp()
      if ($posthog) {
        $posthog.identify(this.anonymousId)
      }
    },

    async hydrateState() {
      const state = await getHydratedState<any>('user')
      if (state)
        this.$patch(state)
    },
  },

  persist: {
    storage: import.meta.client ? persistentStorage : undefined,
    paths: ['anonymousId', 'hasPlayedBefore'],
  } as any,
})
