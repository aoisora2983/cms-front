<script setup lang="ts">
const config = useRuntimeConfig()

useHead({
    title: '検索結果',
    script: [
        {
            async: true,
            src: 'https://cse.google.com/cse.js?cx=' + config.public.googleSearch,
        },
    ],
})

useSeoMeta({
    description: `検索結果`,
})
</script>

<template>
    <main class="max-w-5xl mx-auto p-4">
        <section
            id="about-this-site"
            class="bg-gray-50"
        >
            <div class="gcse-searchresults-only" />
        </section>
    </main>
</template>
