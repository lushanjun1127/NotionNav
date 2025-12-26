import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    include: ['tests/**/*.test.{js,ts,jsx,tsx}'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@components': resolve(__dirname, './components'),
      '@lib': resolve(__dirname, './lib'),
      '@core': resolve(__dirname, './core'),
      '@pages': resolve(__dirname, './pages'),
    }
  }
});