import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Server tests read MONGODB_URI from .env like the real server does.
  test: { environment: 'jsdom', env: loadEnv(mode, process.cwd(), '') },
}));
