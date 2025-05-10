import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/craft/',
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5175,
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:5001',
        ws: true,
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://0.0.0.0:5001',
        changeOrigin: true
      },
      '/health': 'http://0.0.0.0:5001'
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            '@tanstack/react-query',
          ],
        },
      },
    },
  },
});