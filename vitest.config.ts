import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'happy-dom',
    root: './tests',
    environment: 'happy-dom',
    // setupFiles: ['./setup.happy-dom.ts'],
  },
})