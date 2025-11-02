import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  clearScreen: false,
  server: {
    port: 7000,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
  plugins: [react()],
});
