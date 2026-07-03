import { defineStore } from 'pinia'
import { NUXT_API_ROUTES } from '~/constants/api/routes'
import { GetReminderSettingsResponseSchema, UpdateReminderSettingsResponseSchema } from '~/schemas/reminders/reminder.schema'
import { useUserStore } from '~/stores/user'

export const useReminderSettingsStore = defineStore('reminderSettings', {
  state: () => ({
    /** Status for the initial fetch of settings. */
    fetchStatus: 'loading' as 'loading' | 'success' | 'error',
    /** Status for any update/PATCH operations. */
    updateStatus: 'idle' as 'idle' | 'loading' | 'success' | 'error',
    /** Tracks which specific settings are being updated for granular UI feedback. */
    updatingSettings: [] as string[],
    /** The user's current reminder settings. */
    settings: {
      isRegistered: false,
      email: null as string | null,
      isSubscribed: false,
      includeHint: false,
    },
  }),

  getters: {
    isSubscribed(state) {
      return state.settings.isSubscribed
    },
  },

  actions: {
    /**
     * Retrieves the current user's reminder settings from the backend.
     */
    async fetchSettings() {
      const userStore = useUserStore()
      if (!userStore.anonymousId) {
        // This should ideally not happen if called after app hydration
        this.fetchStatus = 'error'
        return
      }

      this.fetchStatus = 'loading'

      try {
        const data = await withMinDelay(
          apiClient(
            GetReminderSettingsResponseSchema,
            NUXT_API_ROUTES.REMINDER_SETTINGS(userStore.anonymousId),
          ),
          500,
        )

        this.settings.isRegistered = data.isRegistered
        this.settings.email = data.email
        this.settings.isSubscribed = data.isActive
        this.settings.includeHint = data.includeHint
        this.fetchStatus = 'success'
      }
      catch {
        this.fetchStatus = 'error'
      }
    },

    /**
     * Updates specific reminder settings for the current user.
     */
    async updateSettings(payload: { isActive?: boolean, includeHint?: boolean }) {
      const userStore = useUserStore()
      if (!userStore.anonymousId)
        return this.updateStatus = 'error'

      this.updateStatus = 'loading'

      const uiKeys = []
      if (payload.isActive !== undefined)
        uiKeys.push('isSubscribed')
      if (payload.includeHint !== undefined)
        uiKeys.push('includeHint')
      this.updatingSettings = uiKeys

      try {
        const url = NUXT_API_ROUTES.UPDATE_REMINDER_SETTINGS(userStore.anonymousId)
        await withMinDelay(
          apiClient(UpdateReminderSettingsResponseSchema, url, {
            method: 'PATCH',
            body: payload,
          }),
          250,
        )

        if (payload.isActive !== undefined)
          this.settings.isSubscribed = payload.isActive
        if (payload.includeHint !== undefined)
          this.settings.includeHint = payload.includeHint

        this.updateStatus = 'success'
      }
      catch (error) {
        console.error('Failed to update settings:', error)
        this.updateStatus = 'error'
      }
      finally {
        this.updatingSettings = []
      }
    },

    /**
     * Updates the local state after a user successfully signs up for reminders.
     * This transitions the UI from the signup form to the settings management view.
     * @param email The email address the user signed up with.
     */
    handleSignupSuccess(email: string) {
      this.settings.email = email
      this.settings.isRegistered = true
      this.settings.isSubscribed = true
      this.settings.includeHint = true
    },
  },
})
