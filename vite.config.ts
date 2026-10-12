/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import path from 'node:path';
import { playwright } from '@vitest/browser-playwright'
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    }
  },
  test: {
    globalSetup: ['tests/globalSetup.ts'],
    projects: [
      {
        test: {
          name: 'unit',
          include: ['src/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        test: {
          name: 'browser',
          include: ['src/**/*.test.tsx'],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [
              { browser: 'chromium' },
            ],
          },
        },
      },
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/types.ts',
        'src/**/*.d.ts',
        'src/shared/mocks/**',
        'src/main.tsx',
        'src/shared/schemas/**',
        'src/**/schema.ts',
      ],
    }
  }
});
