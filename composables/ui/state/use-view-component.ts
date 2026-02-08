import { computed } from 'vue'

import Contact from '~/components/views/contact/Contact.vue'
import Archive from '~/components/views/game/Archive.vue'
import Game from '~/components/views/game/Game.vue'
import UserStats from '~/components/views/game/UserStats.vue'
import HowToPlay from '~/components/views/info/HowToPlay.vue'
import PrivacyPolicy from '~/components/views/legal/PrivacyPolicy.vue'
import TermsOfService from '~/components/views/legal/TermsOfService.vue'
import Menu from '~/components/views/menu/Menu.vue'
import Reminders from '~/components/views/reminders/Reminders.vue'
import Unsubscribe from '~/components/views/reminders/unsubscribe/Unsubscribe.vue'
import Results from '~/components/views/results/Results.vue'

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
