import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { persistentStorage } from '~/utils/browser/storage'

export const useUserStore = defineStore('user', {
  state: () => ({
    /**
     * Unique identifier for anonymous player tracking.
     * Used for leaderboard submissions and PostHog analytics.
     */
    anonymousId: '',
    /**
     * Tracks if the user has played a game before.
     * Used to determine if the tutorial modal should be shown.
     */
    hasPlayedBefore: false,
  }),

  actions: {
    /**
     * Ensures an anonymous ID exists and identifies the user in analytics.
     * Should be called after state hydration.
     */
    initializeAnonymousId() {
      if (!this.anonymousId) {
        this.anonymousId = uuidv4()
      }
      // Sync ID with PostHog analytics
      const { $posthog } = useNuxtApp()
      if ($posthog) {
        $posthog.identify(this.anonymousId)
      }
    },

    /**
     * Manually restores the store from asynchronous storage.
     * Used to bypass timing issues between the persistence plugin and the Nuxt lifecycle.
     */
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
