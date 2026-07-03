import type { ModalType, ViewType } from '~/types/ui/ui.types'
import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  /**
   * Global UI configuration.
   * Manages view switching, modal states, and application health flags.
   */
  state: () => ({
    view: 'menu' as ViewType,
    activeModal: null as ModalType,
    appStatus: {
      rateLimit: {
        isLimited: false,
        expiresAt: null as number | null,
      },
      serviceUnavailable: {
        isUnavailable: false,
        retryAfter: null as number | null,
      },
    },
    isInitialLoad: true,
  }),

  getters: {
  /**
   * Resolves the primary operational state of the application.
   * Used to conditionally block interaction during server outages or rate limits.
   */
    currentAppStatus(state): 'operational' | 'rateLimited' | 'serviceUnavailable' {
      if (state.appStatus.serviceUnavailable.isUnavailable) {
        return 'serviceUnavailable'
      }
      if (state.appStatus.rateLimit.isLimited) {
        return 'rateLimited'
      }
      return 'operational'
    },
  },

  actions: {
    /**
     * Navigates between primary application views (e.g., 'menu', 'game', 'results').
     */
    setView(view: ViewType) {
      this.view = view
    },

    /**
     * Manages the visibility of the global modal overlay.
     * Supports a single active modal at a time.
     */
    showModal(modal: ModalType) {
      this.activeModal = modal
    },

    /**
     * Hides the currently active modal.
     */
    hideModal() {
      this.activeModal = null
    },

    /**
     * Responds to backend traffic management signals.
     * Blocks standard play and displays an informative modal to the user.
     */
    setRateLimited(expiresAt: number) {
      this.appStatus.rateLimit.isLimited = true
      this.appStatus.rateLimit.expiresAt = expiresAt
      this.showModal('rateLimit')
    },

    /**
     * Triggers the service unavailable state and displays the corresponding modal.
     * Used in response to a 503 HTTP status
     */
    setServiceUnavailable(retryAfter: number) {
      this.appStatus.serviceUnavailable.isUnavailable = true
      this.appStatus.serviceUnavailable.retryAfter = retryAfter
      this.showModal('serviceUnavailable')
    },

    /**
     * Resets the application to an operational state once the
     * restriction period has expired.
     */
    clearRateLimited() {
      this.appStatus.rateLimit.isLimited = false
      this.appStatus.rateLimit.expiresAt = null
    },

    /**
     * Clears the service unavailable state, restoring normal app functionality.
     */
    clearServiceUnavailable() {
      this.appStatus.serviceUnavailable.isUnavailable = false
      this.appStatus.serviceUnavailable.retryAfter = null
    },

    /**
     * Flags that the initial application load and entry animation have finished.
     * Used to prevent intro animations from re-triggering on subsequent view changes.
     */
    markInitialLoadComplete() {
      this.isInitialLoad = false
    },
  },

})
