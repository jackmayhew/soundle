import { FASTIFY_API_ROUTES } from '~/constants/api/routes'
import { GetReminderSettingsResponseSchema } from '~/schemas/reminders/reminder.schema'
import { UserIdParamsSchema } from '~/schemas/user/user.schema'

/**
 * Retrieves the reminder settings for a specific user.
 * This endpoint is used by "logged-in" users to manage their own preferences.
 *
 * @method GET
 * @path /api/reminders/:userId
 *
 * @param {string} userId - The user's unique anonymous ID.
 *
 * @returns {GetReminderSettingsResponse} The user's current reminder settings.
 * @throws {400} If the userId parameter is not a valid UUID.
 * @throws {502} If the backend service returns a malformed response.
 */
export default defineEventHandler(async (event) => {
  const params = event.context.params

  // 1. Validate Input
  const validation = UserIdParamsSchema.safeParse({ userId: params?.userId })
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user ID format.',
    })
  }

  // 2. Fetch
  const apiResponse = await fetchBackend(
    event,
    FASTIFY_API_ROUTES.REMINDER_SETTINGS(validation.data.userId),
    { method: 'GET' },
  )

  // 3. Validate Output
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
