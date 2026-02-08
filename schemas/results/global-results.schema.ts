import { z } from 'zod'

export const GlobalResultsResponseSchema = z.object({
  totalPlays: z.number(),
  wins: z.number(),
  losses: z.number(),
  averageTime: z.number(),
  guessDistribution: z.array(z.object({
    guess: z.number(),
    count: z.number(),
  })).nullable(),
})

export type GlobalResultsResponse = z.infer<typeof GlobalResultsResponseSchema>
