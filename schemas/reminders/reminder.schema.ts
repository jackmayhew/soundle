import { z } from 'zod'

export const GetReminderSettingsResponseSchema = z.object({
  email: z.email().nullable(),
  isRegistered: z.boolean(),
  isActive: z.boolean(),
  includeHint: z.boolean(),
})

export const UpdateReminderSettingsBodySchema = z.object({
  isActive: z.boolean().optional(),
  includeHint: z.boolean().optional(),
})

export const UpdateReminderSettingsResponseSchema = z.object({
  success: z.boolean(),
})

export type UpdateReminderSettingsResponse = z.infer<typeof UpdateReminderSettingsResponseSchema>

export const ReminderIdParamSchema = z.object({
  id: z.uuid({ message: 'Invalid ID format.' }),
})
