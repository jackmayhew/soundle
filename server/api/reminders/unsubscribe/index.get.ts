import { FASTIFY_API_ROUTES } from '~/constants/api/routes'
import { UnsubscribeQuerySchema, UnsubscribeResponseSchema } from '~/schemas/reminders/unsubscribe.schema'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const validation = UnsubscribeQuerySchema.safeParse(query)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid input data.',
    })
  }
  const apiResponse = await fetchBackend(
    event,
    FASTIFY_API_ROUTES.UNSUBSCRIBE,
    {
      method: 'GET',
      query: validation.data,
    },
  )
  const responseValidation = UnsubscribeResponseSchema.safeParse(apiResponse)
  if (!responseValidation.success) {
    console.error('API response validation failed for unsubscribe:', responseValidation.error)
    throw createError({
      statusCode: 502,
      statusMessage: 'Received invalid response from the upstream API.',
    })
  }

  return responseValidation.data
})
