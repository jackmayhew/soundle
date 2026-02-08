import { FASTIFY_API_ROUTES } from '~/constants/api/routes'
import {
  ReminderIdParamSchema,
  UpdateReminderSettingsBodySchema,
  UpdateReminderSettingsResponseSchema,
} from '~/schemas/reminders/reminder.schema'

/**
 * @description Updates reminder settings for a subscription using its unique ID.
 * This is primarily used on the public unsubscribe page to allow users to manage
 * their preferences (e.g., re-subscribing).
 *
 * @method PATCH
 * @path /api/reminders/subscription/:id
 *
 * @param {string} id - The unique subscription ID from the URL parameter.
 * @body {UpdateReminderSettingsBodySchema} An object containing the settings to update.
 *
 * @returns {object} A success object: `{ success: true }`.
 * @throws {400} If the `id` parameter or request body fails validation.
 * @throws {502} If the backend service returns a malformed response.
 */
export default defineEventHandler(async (event) => {
  // 1a. Validate ID from URL Parameter
  const params = event.context.params
  const idValidation = ReminderIdParamSchema.safeParse({ id: params?.id })
  if (!idValidation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ID format in URL.',
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
    FASTIFY_API_ROUTES.UPDATE_REMINDER_SETTINGS_BY_ID(idValidation.data.id),
    {
      method: 'PATCH',
      body: bodyValidation.data,
    },
  )

  // 3. Validate Output
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
