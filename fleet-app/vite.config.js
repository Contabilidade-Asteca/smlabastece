import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Vite configuration for the fleet management app.  This config enables the
// React plugin for JSX transformation and defines an alias so that imports
// from '@/…' resolve to the src/ directory.  Keeping the config minimal
// simplifies adoption on platforms like Vercel or Netlify.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});