import { FASTIFY_API_ROUTES } from '~/constants/api/routes'
import { GuessRequestSchema, GuessResultSchema } from '~/schemas/game/guess.schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const validation = GuessRequestSchema.safeParse(body)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid input data.',
    })
  }
  const apiResponse = await fetchBackend(
    event,
    FASTIFY_API_ROUTES.GUESS,
    {
      method: 'POST',
      body: validation.data,
    },
  )
  const responseValidation = GuessResultSchema.safeParse(apiResponse)
  if (!responseValidation.success) {
    console.error('API response validation failed for guess:', responseValidation.error)
    throw createError({
      statusCode: 502,
      statusMessage: 'Received invalid response from the upstream API.',
    })
  }

  return responseValidation.data
})
