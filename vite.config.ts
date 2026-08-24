import path from 'node:path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

const host = process.env.TAURI_DEV_HOST;
const port = Number(process.env.PORT || process.env.VITE_DEV_PORT || 5173);

export default defineConfig({
  clearScreen: false,
  server: {
    // Preferred port. `pnpm dev` starts Vite first, reads the bound URL, and
    // tells Tauri to load it even if this port is taken and Vite hops.
    port: Number.isFinite(port) ? port : 5173,
    strictPort: true,
    host: host || '127.0.0.1',
    hmr: host
      ? {
          protocol: 'ws',
          host,
        }
      : undefined,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
