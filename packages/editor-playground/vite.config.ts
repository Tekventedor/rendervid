import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5180,
  },
  resolve: {
    alias: {
      'lottie-web': '/src/stubs/lottie-web.ts',
    },
  },
});
