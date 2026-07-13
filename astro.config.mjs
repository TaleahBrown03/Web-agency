import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  site: process.env.SITE_URL || 'https://web-agency.vercel.app',
  server: {
    port: Number(process.env.PORT) || 3000,
    host: true,
  },
  vite: {
    server: {
      middlewareMode: false,
      cors: true,
      allowedHosts: 'all',
    }
  }
});
