import type { ModalType, ViewType } from '~/types/ui/ui.types'
import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
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
    setView(view: ViewType) {
      this.view = view
    },

    showModal(modal: ModalType) {
      this.activeModal = modal
    },

    hideModal() {
      this.activeModal = null
    },

    setRateLimited(expiresAt: number) {
      this.appStatus.rateLimit.isLimited = true
      this.appStatus.rateLimit.expiresAt = expiresAt
      this.showModal('rateLimit')
    },

    setServiceUnavailable(retryAfter: number) {
      this.appStatus.serviceUnavailable.isUnavailable = true
      this.appStatus.serviceUnavailable.retryAfter = retryAfter
      this.showModal('serviceUnavailable')
    },

    clearRateLimited() {
      this.appStatus.rateLimit.isLimited = false
      this.appStatus.rateLimit.expiresAt = null
    },

    clearServiceUnavailable() {
      this.appStatus.serviceUnavailable.isUnavailable = false
      this.appStatus.serviceUnavailable.retryAfter = null
    },

    markInitialLoadComplete() {
      this.isInitialLoad = false
    },
  },

})
