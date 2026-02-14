import process from 'node:process'
import { defineNuxtConfig } from 'nuxt/config'
import { IS_DEV } from './constants/app/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/color-mode',
    '@vite-pwa/nuxt',
  ],
  plugins: [
    '~/plugins/app/init.client.ts',
    '~/plugins/integrations/posthog.client.ts',
  ],
  pwa: {
    registerType: 'prompt',
    workbox: {
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          urlPattern: ({ request }) => request.mode === 'navigate',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'pages',
            cacheableResponse: {
              statuses: [200],
            },
          },
        },
      ],
    },
    manifest: {
      name: 'Soundle',
      short_name: 'Soundle',
      display: 'standalone',
      id: '/',
      start_url: '/',
    },
  },
  imports: {
    dirs: [
      'composables/**',
      'utils/**',
      'stores/**',
    ],
  },
  components: [
    {
      path: '~/components/',
      pathPrefix: false,
    },
  ],
  pages: false,
  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: '',
  },
  app: {
    head: {
      title: 'Soundle - A Daily Audio Puzzle',
      link: [
        {
          rel: 'preload',
          href: '/fonts/InterVariable.ttf',
          as: 'font',
          type: 'font/ttf',
          crossorigin: 'anonymous',
        },
        {
          rel: 'preload',
          href: '/fonts/InterVariable-Italic.ttf',
          as: 'font',
          type: 'font/ttf',
          crossorigin: 'anonymous',
        },
        {
          rel: 'preload',
          href: '/fonts/COOPBL.woff',
          as: 'font',
          type: 'font/woff',
          crossorigin: 'anonymous',
        },
      ],
    },
  },
  vite: {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: !IS_DEV,
          drop_debugger: !IS_DEV,
        },
      },
    },
  },
  features: {
    inlineStyles: true,
  },
  nitro: {
    preset: 'cloudflare-pages',
    prerender: {
      routes: ['/'],
    },
  },
  runtimeConfig: {
    apiBaseUrl: process.env.NUXT_API_BASE_URL,
    public: {
      posthogApiKey: process.env.POSTHOG_API_KEY,
      posthogHost: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
    },
  },
})
