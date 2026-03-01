import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import node from '@astrojs/node';
import clerk from '@clerk/astro';

export default defineConfig({
  site: 'https://coshift.nl',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    react(),
    clerk(),
    sitemap({
      i18n: {
        defaultLocale: 'nl',
        locales: {
          nl: 'nl-NL',
          en: 'en-US',
        },
      },
    }),
  ],
  build: {
    assets: '_assets',
  },
});
