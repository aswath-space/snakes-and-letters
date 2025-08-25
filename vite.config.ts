// Vite configuration enabling React and Vitest
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Register the React plugin for JSX/TSX support
  plugins: [react()],
  test: {
    // Use jsdom to simulate the browser for tests
    environment: 'jsdom',
    globals: true,
  },
});
