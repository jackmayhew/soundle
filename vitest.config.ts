import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
  },
  resolve: {
    alias: {
      '~/constants': resolve(__dirname, 'constants'),
      '~/schemas': resolve(__dirname, 'schemas'),
      '~/types': resolve(__dirname, 'types'),
      '~': resolve(__dirname, 'app'),
    },
  },
})
