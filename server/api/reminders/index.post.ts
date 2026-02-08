import { FASTIFY_API_ROUTES } from '~/constants/api/routes'
import { EmailReminderRequestSchema, EmailReminderResponseSchema } from '~/schemas/reminders/email-reminder.schema'

/**
 * Creates a new email reminder subscription for a user.
 * This endpoint handles the initial sign-up process.
 *
 * @method POST
 * @path /api/reminders
 *
 * @body {EmailReminderRequest} The user's email, hint preference, and anonymous ID.
 *
 * @returns {object} A success object: `{ success: true }`.
 * @throws {400} If the request body fails validation.
 * @throws {502} If the backend service returns a malformed response.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // 1. Validate Input
  const validation = EmailReminderRequestSchema.safeParse(body)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email provided.',
    })
  }

  // 2. Fetch
  const apiResponse = await fetchBackend(
    event,
    FASTIFY_API_ROUTES.CREATE_REMINDER,
    {
      method: 'POST',
      body: validation.data,
    },
  )

  // 3. Validate Output
  const responseValidation = EmailReminderResponseSchema.safeParse(apiResponse)
  if (!responseValidation.success) {
    console.error('API response validation failed for reminders:', responseValidation.error)
    throw createError({
      statusCode: 502,
    })
  }

  return responseValidation.data
})
