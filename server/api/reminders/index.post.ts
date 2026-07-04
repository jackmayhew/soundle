import { FASTIFY_API_ROUTES } from '~/constants/api/routes'
import { EmailReminderRequestSchema, EmailReminderResponseSchema } from '~/schemas/reminders/email-reminder.schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const validation = EmailReminderRequestSchema.safeParse(body)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email provided.',
    })
  }
  const apiResponse = await fetchBackend(
    event,
    FASTIFY_API_ROUTES.CREATE_REMINDER,
    {
      method: 'POST',
      body: validation.data,
    },
  )
  const responseValidation = EmailReminderResponseSchema.safeParse(apiResponse)
  if (!responseValidation.success) {
    console.error('API response validation failed for reminders:', responseValidation.error)
    throw createError({
      statusCode: 502,
    })
  }

  return responseValidation.data
})
