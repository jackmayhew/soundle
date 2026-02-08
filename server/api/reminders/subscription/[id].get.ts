import { FASTIFY_API_ROUTES } from '~/constants/api/routes'
import { GetReminderSettingsResponseSchema, ReminderIdParamSchema } from '~/schemas/reminders/reminder.schema'

/**
 * Retrieves reminder settings using a unique subscription ID.
 * This endpoint is fetches the settings associated with
 * the unsubscribe ID to display to the user.
 *
 * @method GET
 * @path /api/reminders/subscription/:id
 *
 * @param {string} id - The unique subscription ID.
 *
 * @returns {GetReminderSettingsResponse} The subscription's current settings.
 * @throws {400} If the `id` parameter is not a valid UUID.
 * @throws {502} If the backend service returns a malformed response.
 */
export default defineEventHandler(async (event) => {
  const params = event.context.params

  // 1. Validate Input
  const validation = ReminderIdParamSchema.safeParse({ id: params?.id })
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ID format.',
    })
  }

  // 2. Fetch from Backend
  const apiResponse = await fetchBackend(
    event,
    FASTIFY_API_ROUTES.REMINDER_SETTINGS_BY_ID(validation.data.id),
    { method: 'GET' },
  )

  // 3. Validate Output
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
