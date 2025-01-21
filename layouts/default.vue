<script setup lang="ts">
const config = useRuntimeConfig()

const scripts = []
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

const metaList = []
if (config.public.googleAdSense != '') {
    metaList.push({
        name: 'google-adsense-account',
        content: config.public.googleAdSense,
    })
}

useHead({
    titleTemplate: (titleChunk) => {
        return titleChunk ? `${titleChunk} - ${config.public.siteTitle}` : config.public.siteTitle
    },
    script: scripts,
    meta: metaList,
})
useSeoMeta({
    description: config.public.siteDescription,
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
