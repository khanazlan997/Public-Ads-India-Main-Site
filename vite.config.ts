import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'remove-vite-client-in-preview',
        transformIndexHtml(html) {
          return html.replace(/<script[^>]*[\s/]src=["']\/?@vite\/client["'][^>]*>\s*<\/script>/gi, '');
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // The app runs Vite in Express middleware mode, which does not own the
      // HTTP upgrade handler needed by the Vite HMR WebSocket client.
      hmr: false,
      watch: null,
    },
  };
});
