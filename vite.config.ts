import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Static build lands in dist/ and is served by server/index.js on EC2.
// In dev, /api is proxied to the Express server (run `npm run server`).
export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist', sourcemap: false },
  server: {
    proxy: {
      '/api': { target: process.env.API_URL || 'http://localhost:8080', changeOrigin: true },
    },
  },
});
