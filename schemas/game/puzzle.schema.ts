import { z } from 'zod'
import { DATE_FORMAT_REGEX } from '~/constants/app/validation'

export const PublicPuzzleDataSchema = z.object({
  puzzleDate: z.string().regex(DATE_FORMAT_REGEX),
  audioUrl: z.string(),
  hint: z.string(),
  difficulty: z.number(),
  puzzleNumber: z.number(),
})

export type PublicPuzzleData = z.infer<typeof PublicPuzzleDataSchema>
