// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        // Proxy /api/webchat → n8n webhook (evita problemas CORS cross-origin en el browser)
        '/api/webchat': {
          target: 'http://localhost:5678',
          rewrite: (path) => path.replace(/^\/api\/webchat/, '/webhook/webchat'),
          changeOrigin: true,
        },
      },
    },
  },

  integrations: [react()],
});