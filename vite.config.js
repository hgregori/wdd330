import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // Entry point is the src directory
  root: resolve(__dirname, 'src'),

  build: {
    // Output to project-root/dist
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },

  server: {
    // Dev server port
    port: 5173,
    open: true,
  },
});
