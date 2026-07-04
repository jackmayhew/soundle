import { FASTIFY_API_ROUTES } from '~/constants/api/routes'
import { UpdateReminderSettingsBodySchema, UpdateReminderSettingsResponseSchema } from '~/schemas/reminders/reminder.schema'
import { UserIdParamsSchema } from '~/schemas/user/user.schema'

export default defineEventHandler(async (event) => {
  const params = event.context.params
  const userIdValidation = UserIdParamsSchema.safeParse({ userId: params?.userId })
  if (!userIdValidation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user ID format in URL.',
    })
  }
  const body = await readBody(event)
  const bodyValidation = UpdateReminderSettingsBodySchema.safeParse(body)
  if (!bodyValidation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body.',
    })
  }
  const apiResponse = await fetchBackend(
    event,
    FASTIFY_API_ROUTES.UPDATE_REMINDER_SETTINGS(userIdValidation.data.userId),
    {
      method: 'PATCH',
      body: bodyValidation.data,
    },
  )
  const responseValidation = UpdateReminderSettingsResponseSchema.safeParse(apiResponse)
  if (!responseValidation.success) {
    console.error('API response validation failed for update reminder settings:', responseValidation.error)
    throw createError({
      statusCode: 502,
      statusMessage: 'Received invalid response from the upstream API.',
    })
  }

  return responseValidation.data
})
