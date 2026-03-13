export default defineNuxtConfig({
  ssr: true,

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  modules: [
    '@clerk/nuxt',
    '@nuxtjs/i18n',
  ],

  css: [
    '~/assets/styles/global.css',
    '~/assets/styles/animations.css',
    '~/assets/styles/utilities.css',
    '~/assets/styles/tiptap-editor.css',
  ],

  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'nl',
    restructureDir: false,
    locales: [
      { code: 'nl', language: 'nl-NL', name: 'Nederlands' },
      { code: 'en', language: 'en-US', name: 'English' },
    ],
    detectBrowserLanguage: false,
    vueI18n: './i18n.config.ts',
    bundle: {
      optimizeTranslationDirective: false,
    },
  },

  runtimeConfig: {
    clerk: {
      secretKey: process.env.NUXT_CLERK_SECRET_KEY,
    },
    public: {
      clerk: {
        publishableKey: process.env.NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      },
    },
  },

  clerk: {
    signInUrl: '/sign-in',
    signUpUrl: '/sign-up',
    signInForceRedirectUrl: '/',
    signUpForceRedirectUrl: '/',
  },

  nitro: {
    preset: 'aws-amplify',
  },

  vite: {
    optimizeDeps: {
      exclude: ['@prisma/client'],
    },
  },

  experimental: {
    viewTransition: false,
  },

  app: {
    head: {
      script: [
        {
          innerHTML: `(function(){try{if(localStorage.getItem('theme')==='dark'){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})()`,
          tagPosition: 'head',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preload', href: '/fonts/PlusJakartaSans-Regular.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
        { rel: 'preload', href: '/fonts/PlusJakartaSans-Medium.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
        { rel: 'preload', href: '/fonts/PlusJakartaSans-SemiBold.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
        { rel: 'preload', href: '/fonts/PlusJakartaSans-Bold.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
        { rel: 'preload', href: '/fonts/PlusJakartaSans-ExtraBold.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
      ],
    },
    pageTransition: false,
  },

  compatibilityDate: '2025-01-01',
})
