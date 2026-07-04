import { FASTIFY_API_ROUTES } from '~/constants/api/routes'
import {
  ReminderIdParamSchema,
  UpdateReminderSettingsBodySchema,
  UpdateReminderSettingsResponseSchema,
} from '~/schemas/reminders/reminder.schema'

export default defineEventHandler(async (event) => {
  const params = event.context.params
  const idValidation = ReminderIdParamSchema.safeParse({ id: params?.id })
  if (!idValidation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ID format in URL.',
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
    FASTIFY_API_ROUTES.UPDATE_REMINDER_SETTINGS_BY_ID(idValidation.data.id),
    {
      method: 'PATCH',
      body: bodyValidation.data,
    },
  )
  const responseValidation = UpdateReminderSettingsResponseSchema.safeParse(apiResponse)
  if (!responseValidation.success) {
    console.error('API response validation failed for update reminder settings by ID:', responseValidation.error)
    throw createError({
      statusCode: 502,
      statusMessage: 'Received invalid response from the upstream API.',
    })
  }

  return responseValidation.data
})
