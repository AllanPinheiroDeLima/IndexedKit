import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    name: 'happy-dom',
    root: './tests',
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
  },
})