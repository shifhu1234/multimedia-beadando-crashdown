import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            if (id.includes('@pixi') || id.includes('pixi.js') || id.includes('earcut') || id.includes('eventemitter3')) {
              return 'vendor-pixi';
            }
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    port: 8890,
    host: true,
  },
});
