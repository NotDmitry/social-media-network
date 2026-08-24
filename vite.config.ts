import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/social-media-network/',
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(import.meta.dirname, 'src/assets'),
      '@pages': path.resolve(import.meta.dirname, 'src/pages'),
      '@widgets': path.resolve(import.meta.dirname, 'src/widgets'),
    },
  },
});
