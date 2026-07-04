import { FASTIFY_API_ROUTES } from '~/constants/api/routes'
import { GetReminderSettingsResponseSchema, ReminderIdParamSchema } from '~/schemas/reminders/reminder.schema'

export default defineEventHandler(async (event) => {
  const params = event.context.params
  const validation = ReminderIdParamSchema.safeParse({ id: params?.id })
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ID format.',
    })
  }
  const apiResponse = await fetchBackend(
    event,
    FASTIFY_API_ROUTES.REMINDER_SETTINGS_BY_ID(validation.data.id),
    { method: 'GET' },
  )
  const responseValidation = GetReminderSettingsResponseSchema.safeParse(apiResponse)
  if (!responseValidation.success) {
    console.error('API response validation failed for reminder settings by ID:', responseValidation.error)
    throw createError({
      statusCode: 502,
      statusMessage: 'Received invalid response from the upstream API.',
    })
  }

  return responseValidation.data
})
