import { z } from 'zod'
import { DATE_FORMAT_REGEX } from '~/constants/app/validation'
import { HINT_CODE_VALUES } from '~/constants/game/hint-codes'

export const GuessRequestSchema = z.object({
  newGuess: z.string()
    .trim()
    .min(1, { message: 'Guess cannot be empty.' })
    .max(100, { message: '100 characters max.' }),
  previousGuesses: z.array(z.string()),
  puzzleDate: z.string().regex(DATE_FORMAT_REGEX),
})

export type GuessRequest = z.infer<typeof GuessRequestSchema>

export const GuessResultSchema = z.object({
  correct: z.boolean(),
  hint: z.enum(HINT_CODE_VALUES).nullable(),
  answer: z.string().nullable(),
})

export type GuessResult = z.infer<typeof GuessResultSchema>
