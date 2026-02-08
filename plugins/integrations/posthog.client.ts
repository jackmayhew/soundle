import posthog from 'posthog-js'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  if (config.public.posthogApiKey) {
    posthog.init(config.public.posthogApiKey as string, {
      api_host: config.public.posthogHost as string,
      person_profiles: 'identified_only',
      capture_pageview: false,
      // autocapture: false,
      disable_session_recording: true,
    })

    // Catch Vue Errors (Template crashes, logic errors)
    const vueErrorHandler = nuxtApp.vueApp.config.errorHandler
    nuxtApp.vueApp.config.errorHandler = (err, instance, info) => {
      posthog.capture('$exception', {
        $exception_type: (err as Error).name || 'VueError',
        $exception_message: (err as Error).message,
        $exception_stack: (err as Error).stack,
        vue_info: info,
      })

      if (vueErrorHandler) {
        vueErrorHandler(err, instance, info)
      }
    }
  }

  return {
    provide: {
      posthog,
    },
  }
})
