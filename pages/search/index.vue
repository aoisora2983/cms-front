<script setup lang="ts">
const config = useRuntimeConfig()

const title = 'サイト内検索結果(Google Programmable Search Engine使用)'
const description = 'Googleの「Programmable Search Engine」を使ったサイト内の検索結果です。Google検索を使っているため、文字のゆらぎ、類似語等幅広く対応しています。最新記事が表示されるようになるまで少し時間を置く必要があることにご留意ください。'

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
