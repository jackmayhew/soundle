import type { HintCodeType } from '~/types/game/hint-code.types'

/**
 * Standardized codes and user-facing messages for guess feedback.
 * These ensure consistency between the backend validation and the frontend display.
 */

export const HintCode = {
  WAY_OFF: 'WAY_OFF',
  SIMILAR_CATEGORY: 'SIMILAR_CATEGORY',
  SIMILAR_SOUND: 'SIMILAR_SOUND',
  TOO_GENERAL: 'TOO_GENERAL',
  CORRECT_SOURCE: 'CORRECT_SOURCE',
  CORRECT_ACTION: 'CORRECT_ACTION',
  VERY_CLOSE: 'VERY_CLOSE',
} as const

export const hintMessages: Record<HintCodeType, string> = {
  [HintCode.WAY_OFF]: 'Way off. Try a different direction.',
  [HintCode.SIMILAR_CATEGORY]: 'You\'re in the right category!',
  [HintCode.SIMILAR_SOUND]: 'It sounds just like that, but it\'s a different source.',
  [HintCode.TOO_GENERAL]: 'You\'re on the right track, but be more specific.',
  [HintCode.CORRECT_SOURCE]: 'You found the right source, but what is it doing?',
  [HintCode.CORRECT_ACTION]: 'You have the right action, but what is making the sound?',
  [HintCode.VERY_CLOSE]: 'You\'re extremely close!',
}

export const HINT_CODE_VALUES = [
  'WAY_OFF',
  'SIMILAR_CATEGORY',
  'SIMILAR_SOUND',
  'TOO_GENERAL',
  'CORRECT_SOURCE',
  'CORRECT_ACTION',
  'VERY_CLOSE',
] as const
