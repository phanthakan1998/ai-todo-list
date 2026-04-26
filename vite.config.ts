import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      thresholds: { statements: 90, branches: 85, functions: 90, lines: 90 },
      exclude: ['src/main.tsx', 'src/types/**', 'src/constants/**'],
    },
  },
})
