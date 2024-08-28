import { defineConfig } from 'vitest/config'
import { loadEnv } from "vite";
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    name: 'happy-dom',
    root: './tests',
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    env: loadEnv('', process.cwd(), ''),
    reporters: ["verbose"],
    coverage: {
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      exclude: ['**/node_modules/**'],
      provider: 'istanbul' // or 'v8'
    },
  },
})