import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Static build lands in dist/ and is served by server/index.js on EC2.
export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist', sourcemap: false },
});
