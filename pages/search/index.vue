<script setup lang="ts">
const config = useRuntimeConfig()

const title = 'サイト内検索結果(Google Programmable Search Engine)'
const description = 'Googleの「Programmable Search Engine」を使ったサイト内の検索結果です。'

useHead({
    title: title,
    meta: [
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
    ],
    script: [
        {
            async: true,
            src: 'https://cse.google.com/cse.js?cx=' + config.public.googleSearch,
        },
    ],
})

useSeoMeta({
    description: description,
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
