import type { NuxtPage } from 'nuxt/schema'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss', '@nuxt/image', '@pinia/nuxt'],
    plugins: [
        {
            src: '@/plugins/clickOutside.ts',
        },
    ],
    components: [
        {
            path: '~/components',
            pathPrefix: false,
        },
        {
            path: '~/components/atoms',
            prefix: 'Atom',
        },
        {
            path: '~/components/molecules',
            prefix: 'Molecule',
        },
        {
            path: '~/components/organisms',
            prefix: 'Organism',
        },
    ],
    devtools: { enabled: false },
    app: {
        head: {
            htmlAttrs: {
                lang: 'ja',
                prefix: 'og: https://ogp.me/ns#',
            },
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            meta: [
                {
                    name: 'icon',
                    content: 'favicon.ico',
                },
                {
                    name: 'apple-touchi-icon',
                    content: 'webclip.png',
                },
                {
                    name: 'format-detection',
                    content: 'telephone=no',
                },
                {
                    property: 'og:type',
                    content: 'website',
                },
                {
                    property: 'og:site_name',
                    content: process.env.NUXT_PUBLIC_SITE_TITLE,
                },
                {
                    property: 'og:image',
                    content: process.env.NUXT_PUBLIC_IMAGE_URL + '/img/logo.webp',
                },
            ],
            link: [
                { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons&display=block' },
            ],
        },
        pageTransition: {
            name: 'page',
            mode: 'out-in',
        },
    },
    css: ['@/assets/css/main.css'],
    runtimeConfig: {
        public: {
            env: process.env.APP_ENV || 'local',
            siteTitle: process.env.NUXT_PUBLIC_SITE_TITLE || '',
            siteDescription: process.env.NUXT_PUBLIC_SITE_DESCRIPTION || '',
            apiUrl: process.env.NUXT_PUBLIC_API_URL || '',
            imageUrl: process.env.NUXT_PUBLIC_IMAGE_URL || '',
            copyRight: process.env.NUXT_PUBLIC_COPY_RIGHT || '',
            ga4: process.env.NUXT_PUBLIC_GA4_TAG || '',
            googleAdSense: process.env.NUXT_PUBLIC_GOOGLE_ADSENSE || '',
            googleSearch: process.env.NUXT_PUBLIC_GOOGLE_SEARCH || '',
        },
    },
    routeRules: {
        '/': { isr: 60 },
        '/blog': { isr: 60 },
        '/blog/**': { isr: 60 },
        '/portfolio': { isr: 60 },
        '/portfolio/**': { isr: 60 },
        '/opinion': { isr: true },
        '/manage/': { ssr: false },
        '/manage/**': { ssr: false },
    },
    experimental: {
        appManifest: false,
        payloadExtraction: true,
    },
    compatibilityDate: '2025-01-15',
    nitro: {
        compressPublicAssets: true,
    },
    vite: {
        server: {
            hmr: {
                protocol: 'wss',
            },
        },
    },
    hooks: {
        'pages:extend'(pages) {
            function setMiddleware(pages: NuxtPage[]) {
                for (const page of pages) {
                    if (page.path.match(/^\/manage/)) {
                        page.meta ||= {}
                        page.meta.middleware = ['authenticated']
                    }
                    if (page.children) {
                        setMiddleware(page.children)
                    }
                }
            }
            setMiddleware(pages)
        },
    },
    eslint: {
        config: {
            stylistic: {
                indent: 4,
                quotes: 'single',
                semi: false,
            },
        },
    },
    image: {
        domains: [
            process.env.NUXT_PUBLIC_IMAGE_DOMAIN ?? '',
        ],
        alias: {
            uploader: process.env.NUXT_PUBLIC_IMAGE_URL ?? '',
        },
    },
})
