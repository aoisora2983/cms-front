<script setup lang="ts">
const config = useRuntimeConfig()

useHead({
    meta: [
        {
            name: 'robots',
            content: 'noindex',
        },
    ],
    titleTemplate: (titleChunk) => {
        return titleChunk ? `${titleChunk} - ${config.public.siteTitle}` : config.public.siteTitle
    },
})
</script>

<template>
    <div class="flex flex-col min-h-screen bg-gray-50">
        <OrganismAdminNavigationHeader />
        <div class="flex-grow flex mt-20">
            <slot />
        </div>
        <OrganismAdminNavigationFooter />

        <OrganismMessageModal />
        <OrganismConfirmModal />
        <OrganismInfoModal />
        <OrganismCorrectModal />
        <OrganismLoading />
    </div>
</template>
