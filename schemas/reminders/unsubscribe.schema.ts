import { z } from 'zod'

export const UnsubscribeQuerySchema = z.object({
  id: z.string().uuid('Invalid ID format.'),
})

export const UnsubscribeResponseSchema = z.object({
  success: z.boolean(),
})

export type UnsubscribeQuery = z.infer<typeof UnsubscribeQuerySchema>
