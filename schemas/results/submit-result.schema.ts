import { z } from 'zod'

export const SubmitResultRequestSchema = z.object({
  puzzleDate: z.string(),
  won: z.boolean(),
  guessCount: z.number().int().min(1).max(6),
  time: z.number().int().min(0).max(600000),
  anonymousId: z.uuid(),
})

export type SubmitResultRequest = z.infer<typeof SubmitResultRequestSchema>
