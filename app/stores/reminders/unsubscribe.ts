import { defineStore } from 'pinia'
import { NUXT_API_ROUTES } from '~/constants/api/routes'
import { GetReminderSettingsResponseSchema, UpdateReminderSettingsResponseSchema } from '~/schemas/reminders/reminder.schema'
import { UnsubscribeResponseSchema } from '~/schemas/reminders/unsubscribe.schema'

export const useUnsubscribeStore = defineStore('unsubscribe', {
  state: () => ({
    id: null as string | null,
    fetchStatus: 'loading' as 'loading' | 'success' | 'error',
    updateStatus: 'idle' as 'idle' | 'loading' | 'success' | 'error',
    updatingSettings: [] as string[],
    settings: {
      email: null as string | null,
      isSubscribed: false,
      includeHint: false,
    },
    unsubscribeResult: 'idle' as 'idle' | 'success' | 'error',
  }),

  actions: {
    setId(id: string) {
      this.id = id
    },

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
