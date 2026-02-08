import { FASTIFY_API_ROUTES } from '~/constants/api/routes'
import { UpdateReminderSettingsBodySchema, UpdateReminderSettingsResponseSchema } from '~/schemas/reminders/reminder.schema'
import { UserIdParamsSchema } from '~/schemas/user/user.schema'

/**
 * Updates the reminder settings for a specific user.
 * Allows partial updates (e.g., changing only `isActive` or `includeHint`).
 *
 * @method PATCH
 * @path /api/reminders/:userId
 *
 * @param {string} userId - The user's unique anonymous ID.
 * @body {UpdateReminderSettingsBodySchema} An object with the settings to update.
 *
 * @returns {object} A success object: `{ success: true }`.
 * @throws {400} If the userId or request body fails validation.
 * @throws {502} If the backend service returns a malformed response.
 */
export default defineEventHandler(async (event) => {
  // 1a. Validate URL Parameter
  const params = event.context.params
  const userIdValidation = UserIdParamsSchema.safeParse({ userId: params?.userId })
  if (!userIdValidation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user ID format in URL.',
    })
  }

  // 1b. Validate Request Body
  const body = await readBody(event)
  const bodyValidation = UpdateReminderSettingsBodySchema.safeParse(body)
  if (!bodyValidation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body.',
    })
  }

  // 2. Fetch
  const apiResponse = await fetchBackend(
    event,
    FASTIFY_API_ROUTES.UPDATE_REMINDER_SETTINGS(userIdValidation.data.userId),
    {
      method: 'PATCH',
      body: bodyValidation.data,
    },
  )

  // 3. Validate Output
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
