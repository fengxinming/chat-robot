import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/chat-robot/',
  plugins: [react()],
  resolve: {
    alias: {
      'chat-robot': fileURLToPath(new URL('../chat-robot/src', import.meta.url))
    }
  },
  build: {
    outDir: '../../gh-pages',
    emptyOutDir: true
  },
  server: {
    open: true
  }
});
