import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // Entry point is the src directory
  root: resolve(import.meta.dirname, 'src'),

  build: {
    // Output to project-root/dist
    outDir: resolve(import.meta.dirname, 'dist'),
    emptyOutDir: true,
  },

  server: {
    // Dev server port
    port: 5173,
    open: true,
  },
});
