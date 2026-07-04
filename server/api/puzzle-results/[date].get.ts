import { FASTIFY_API_ROUTES } from '~/constants/api/routes'
import { DateParamSchema } from '~/schemas/common/date.schema'
import { GlobalResultsResponseSchema } from '~/schemas/results/global-results.schema'

export default defineEventHandler(async (event) => {
  const date = event.context.params?.date
  const dateValidation = DateParamSchema.safeParse(date)
  if (!dateValidation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A valid date parameter (YYYY-MM-DD) is required.',
    })
  }
  const apiResponse = await fetchBackend(
    event,
    FASTIFY_API_ROUTES.GLOBAL_RESULTS(dateValidation.data),
  )
  const responseValidation = GlobalResultsResponseSchema.safeParse(apiResponse)
  if (!responseValidation.success) {
    console.error('API response validation failed for global results:', responseValidation.error)
    throw createError({
      statusCode: 502,
      statusMessage: 'Received invalid response from the upstream API.',
    })
  }

  return responseValidation.data
})
