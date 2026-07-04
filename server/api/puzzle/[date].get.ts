import { FASTIFY_API_ROUTES } from '~/constants/api/routes'
import { DateParamSchema } from '~/schemas/common/date.schema'
import { PublicPuzzleDataSchema } from '~/schemas/game/puzzle.schema'

export default defineEventHandler(async (event) => {
  const date = event.context.params?.date
  const dateValidation = DateParamSchema.safeParse(date)
  if (!dateValidation.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid Date' })
  }
  const apiResponse = await fetchBackend(
    event,
    FASTIFY_API_ROUTES.PUZZLE(dateValidation.data),
  )
  const responseValidation = PublicPuzzleDataSchema.safeParse(apiResponse)
  if (!responseValidation.success) {
    throw createError({ statusCode: 502, statusMessage: 'Invalid Upstream Response' })
  }

  return responseValidation.data
})
