import { defineStore } from 'pinia'
import { NUXT_API_ROUTES } from '~/constants/api/routes'
import { GetReminderSettingsResponseSchema, UpdateReminderSettingsResponseSchema } from '~/schemas/reminders/reminder.schema'
import { UnsubscribeResponseSchema } from '~/schemas/reminders/unsubscribe.schema'

export const useUnsubscribeStore = defineStore('unsubscribe', {
  state: () => ({
    /** The unique ID captured from the URL. */
    id: null as string | null,
    /** Status for fetching the settings associated with the ID. */
    fetchStatus: 'loading' as 'loading' | 'success' | 'error',
    /** Status for PATCH updates made from the unsubscribe page. */
    updateStatus: 'idle' as 'idle' | 'loading' | 'success' | 'error',
    /** Tracks which specific settings are being updated for granular UI feedback. */
    updatingSettings: [] as string[],
    /** The settings associated with the unsubscribe ID. */
    settings: {
      email: null as string | null,
      isSubscribed: false,
      includeHint: false,
    },
    /** The result of the final one-click unsubscribe action. */
    unsubscribeResult: 'idle' as 'idle' | 'success' | 'error',
  }),

  actions: {
    /**
     * Captures the unique ID from the URL to initialize the unsubscribe process.
     */
    setId(id: string) {
      this.id = id
    },

    /**
     * Fetches the settings associated with the unsubscribe ID to display to the user.
     */
    async fetchSettingsById() {
      if (!this.id)
        return this.fetchStatus = 'error'

      this.fetchStatus = 'loading'

      try {
        const data = await withMinDelay(
          apiClient(
            GetReminderSettingsResponseSchema,
            NUXT_API_ROUTES.REMINDER_SETTINGS_BY_ID(this.id),
          ),
          500,
        )

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
     * Allows a user to toggle individual settings from the unsubscribe page.
     */
    async updateSettingsById(payload: { isActive?: boolean, includeHint?: boolean }) {
      if (!this.id)
        return this.updateStatus = 'error'

      this.updateStatus = 'loading'
      this.unsubscribeResult = 'idle'

      const uiKeys = []
      if (payload.isActive !== undefined)
        uiKeys.push('isSubscribed')
      if (payload.includeHint !== undefined)
        uiKeys.push('includeHint')
      this.updatingSettings = uiKeys

      try {
        await withMinDelay(
          apiClient(UpdateReminderSettingsResponseSchema, NUXT_API_ROUTES.UPDATE_REMINDER_SETTINGS_BY_ID(this.id), {
            method: 'PATCH',
            body: payload,
          }),
          400,
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
     * Executes the final, one-click unsubscribe action.
     */
    async performUnsubscribe() {
      if (!this.id)
        return this.unsubscribeResult = 'error'

      // Optimistically update UI
      this.updatingSettings = ['isSubscribed', 'includeHint']

      try {
        await withMinDelay(
          apiClient(UnsubscribeResponseSchema, NUXT_API_ROUTES.UNSUBSCRIBE, {
            query: { id: this.id },
          }),
          1500,
        )

        this.settings.isSubscribed = false
        this.settings.includeHint = false
        this.unsubscribeResult = 'success'
      }
      catch {
        this.unsubscribeResult = 'error'
      }
      finally {
        this.updatingSettings = []
        // Reset the result status after a few seconds to clear the UI message
        setTimeout(() => {
          this.unsubscribeResult = 'idle'
        }, 3000)
      }
    },

  },
})
