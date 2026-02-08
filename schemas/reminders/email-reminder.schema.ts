import { z } from 'zod'

export const EmailReminderRequestSchema = z.object({
  email: z.email(),
  includeHint: z.boolean(),
  anonymousId: z.string(),
})

export const EmailReminderResponseSchema = z.object({
  success: z.boolean(),
})

export type EmailReminderRequest = z.infer<typeof EmailReminderRequestSchema>
