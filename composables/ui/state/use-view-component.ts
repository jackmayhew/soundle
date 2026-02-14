import { computed } from 'vue'

import Contact from '~/views/contact/Contact.vue'
import Archive from '~/views/game/Archive.vue'
import Game from '~/views/game/Game.vue'
import UserStats from '~/views/game/UserStats.vue'
import HowToPlay from '~/views/info/HowToPlay.vue'
import PrivacyPolicy from '~/views/legal/PrivacyPolicy.vue'
import TermsOfService from '~/views/legal/TermsOfService.vue'
import Menu from '~/views/menu/Menu.vue'
import Reminders from '~/views/reminders/Reminders.vue'
import Unsubscribe from '~/views/reminders/unsubscribe/Unsubscribe.vue'
import Results from '~/views/results/Results.vue'

/**
 * Resolves the currently active main view component.
 * It watches the UI store's `view` state and returns the corresponding
 * page-level component to be rendered in the main layout.
 */
export function useAppViewState() {
  const uiStore = useUiStore()

  const currentComponent = computed(() => {
    switch (uiStore.view) {
      case 'game':
        return Game
      case 'results':
        return Results
      case 'archive':
        return Archive
      case 'howToPlay':
        return HowToPlay
      case 'contact':
        return Contact
      case 'userStats':
        return UserStats
      case 'reminders':
        return Reminders
      case 'unsubscribe':
        return Unsubscribe
      case 'privacy':
        return PrivacyPolicy
      case 'terms':
        return TermsOfService
      case 'menu':
      default:
        return Menu
    }
  })

  return { currentComponent }
}
