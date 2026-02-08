import type { HintCodeType } from '~/types/game/hint-code.types'

export interface GuessResult {
  text: string
  correct: boolean
  hint: HintCodeType | null
}
