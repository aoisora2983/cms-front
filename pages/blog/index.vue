<script setup lang="ts">
import { getOpenArticleList } from '~/api/apis/blog/getOpenArticleList'
import type { Breadcrumb } from '~/api/models/common'

useHead({
    title: 'ブログ記事一覧',
})

useSeoMeta({
    description: `ブログの記事一覧です。`,
})
const articleList = await getOpenArticleList({
    keyword: null,
    tags: null,
    limit: null,
    page: null,
})

const breadcrumb: Breadcrumb[] = []
breadcrumb.push({
    label: 'Home',
    link: '/',
})
breadcrumb.push({
    label: 'Blog',
    link: '',
})
</script>

<template>
    <main class="max-w-4xl mx-auto p-4">
        <AtomBreadcrumb :breadcrumb="breadcrumb" />
        <section
            id="blog-list"
            class="max-w-5xl mx-auto p-4 mt-10 sm:mt-32"
        >
            <h1 class="text-4xl sm:text-6xl font-bold mb-8 text-center">
                Blog
            </h1>
            <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-6 mb-8 items-stretch">
                <li
                    v-for="(article, index) in articleList.articles"
                    :key="index"
                    class="h-full"
                >
                    <MoleculeBlogCard
                        :article="article"
                        :tag-limit="10"
                    />
                </li>
            </ul>
        </section>
    </main>
</template>
