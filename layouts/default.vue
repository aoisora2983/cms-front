<script setup lang="ts">
import { useJsonLd } from '~/composables/useJsonLd'

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const { graphNodes, addJsonLd, clearJsonLd } = useJsonLd()

const baseUrl = config.public.siteUrl
const getCanonicalPath = (path: string) => {
    if (path.endsWith('/')) {
        path = path.slice(0, -1)
    }
    return baseUrl + path
}

const scripts: { type: string, async?: boolean, src?: string, innerHTML?: string }[] = []
if (config.public.ga4 != '') {
    scripts.push({
        type: 'text/javascript',
        async: true,
        src: `https://www.googletagmanager.com/gtag/js?id=${config.public.ga4}`,
    })
    scripts.push({
        type: 'text/javascript',
        innerHTML: `window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${config.public.ga4}');`,
    })
}

const metaList: { name: string, content: string }[] = []
if (config.public.googleAdSense != '') {
    metaList.push({
        name: 'google-adsense-account',
        content: config.public.googleAdSense,
    })

    scripts.push({
        async: true,
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + config.public.googleAdSense,
        crossorigin: 'anonymous',
    })
}

metaList.push({
    property: 'og:url',
    content: getCanonicalPath(route.path),
})

useHead({
    titleTemplate: (titleChunk) => {
        return titleChunk
            ? `${titleChunk} - ${config.public.siteTitle}`
            : config.public.siteTitle
    },
    script: scripts,
    meta: metaList,
})

useHead(() => ({
    link: [
        {
            rel: 'canonical',
            href: getCanonicalPath(route.path),
        },
    ],
}))
useSeoMeta({
    description: config.public.siteDescription,
})

// JSON-LD Organizationは共通
const setCommonNodes = () => {
    addJsonLd({
        '@type': 'Organization',
        'logo': config.public.imageUrl + '/img/logo.webp',
        'url': baseUrl,
        'name': config.public.siteTitle,
        'founder': {
            '@type': 'Person',
            'url': baseUrl,
            'name': config.public.author,
        },
    })
}

setCommonNodes()
router.beforeEach((to, from) => {
    // 実際にページが変わる場合のみクリア
    if (to.path !== from.path) {
        clearJsonLd()
        setCommonNodes() // 共通のOrganizationを再度セット
    }
})

useHead({
    script: [
        {
            key: 'jsonld-graph',
            type: 'application/ld+json',
            innerHTML: computed(() => JSON.stringify({
                '@context': 'https://schema.org',
                '@graph': graphNodes.value,
            })),
            tagPosition: 'bodyClose',
        },
    ],
})
</script>

<template>
    <div class="flex flex-col h-screen bg-white">
        <OrganismNavigationHeader />
        <div class="flex-grow mt-20">
            <div class="page w-full">
                <slot />
            </div>
        </div>
        <OrganismNavigationFooter />
        <OrganismLoading />
    </div>
</template>
