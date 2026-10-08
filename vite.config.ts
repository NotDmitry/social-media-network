/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import path from 'node:path';
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
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/types.ts',
        'src/**/*.d.ts',
        'src/shared/mocks/**',
        'src/main.tsx',
      ],
    }
  }
});
