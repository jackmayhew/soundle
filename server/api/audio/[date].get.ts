import { FASTIFY_API_ROUTES } from '~/constants/api/routes'
import { DateParamSchema } from '~/schemas/common/date.schema'

export default defineEventHandler(async (event) => {
  const date = getRouterParam(event, 'date')
  const validation = DateParamSchema.safeParse(date)
  if (!validation.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid date format' })
  }

  const config = useRuntimeConfig(event)
  const backendUrl = `${config.apiBaseUrl}${FASTIFY_API_ROUTES.SOUND(validation.data)}`

  // Audio stays streamed through H3 instead of being parsed as JSON.
  return proxyRequest(event, backendUrl, {
    headers: {
      'X-Forwarded-For': getRequestIP(event) || '',
    },
  })
})
