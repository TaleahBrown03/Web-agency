import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  site: process.env.SITE_URL || 'https://web-agency.vercel.app',
  server: {
    port: Number(process.env.PORT) || Number(process.env.DEV_PORT) || 4321,
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
