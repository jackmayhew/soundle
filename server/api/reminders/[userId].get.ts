import { FASTIFY_API_ROUTES } from '~/constants/api/routes'
import { GetReminderSettingsResponseSchema } from '~/schemas/reminders/reminder.schema'
import { UserIdParamsSchema } from '~/schemas/user/user.schema'

export default defineEventHandler(async (event) => {
  const params = event.context.params
  const validation = UserIdParamsSchema.safeParse({ userId: params?.userId })
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user ID format.',
    })
  }
  const apiResponse = await fetchBackend(
    event,
    FASTIFY_API_ROUTES.REMINDER_SETTINGS(validation.data.userId),
    { method: 'GET' },
  )
  const responseValidation = GetReminderSettingsResponseSchema.safeParse(apiResponse)
  if (!responseValidation.success) {
    console.error('API response validation failed for reminder settings:', responseValidation.error)
    throw createError({
      statusCode: 502,
      statusMessage: 'Received invalid response from the upstream API.',
    })
  }

  return responseValidation.data
})
