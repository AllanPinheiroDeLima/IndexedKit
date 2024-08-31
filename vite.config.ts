/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import { loadEnv } from "vite";
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'node:path';

export default defineConfig({
  esbuild: {
    drop: ['console', 'debugger']
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'), // ponto de entrada da sua biblioteca
      name: 'SimpleDataStore', // nome da biblioteca
      fileName: (format) => `simple-data-store.${format}.js`, // nome do arquivo de saída
      formats: ['es', 'umd'], // formatos de saída
    },
    // rollupOptions: {
    //   // Certifique-se de que você não inclua as dependências na build da biblioteca
    //   external: ['uuid'], // adicione outras dependências que não deseja incluir
    //   output: {
    //     globals: {
    //       uuid: 'uuid', // nome global para a dependência externa
    //     },
    //   },
    // },
  },
  plugins: [tsconfigPaths()],
  test: {
    name: 'happy-dom',
    root: './tests',
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    env: loadEnv('', process.cwd(), ''),
    reporters: ["verbose"],
    coverage: {
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      exclude: ['**/node_modules/**'],
      provider: 'istanbul', // or 'v8'
    },
  },
})