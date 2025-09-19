<script setup lang="ts">
import { getOpenArticleList } from '~/api/apis/blog/getOpenArticleList'
import { getTag } from '~/api/apis/blog/getTag'
import type { Breadcrumb } from '~/api/models/common'

const route = useRoute()
const routeId = route.params.id as string
const id = parseInt(routeId)

const tag = await getTag({
    id: id,
})

const articleList = await getOpenArticleList({
    keyword: null,
    tags: [id],
    limit: null,
    page: null,
})

if (articleList.total == 0) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Page Not Found',
    })
}

const title = `${tag.label}に関連する記事一覧`
const description = `${tag.label}に関連する記事の一覧です。不具合対処の備忘録や、便利なテクニック、ポエム等を掲載しています。`

const config = useRuntimeConfig()
useHead({
    title: title,
    meta: [
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: config.public.imageUrl + tag.icon_path },
    ],
})

useSeoMeta({
    description: description,
})

const breadcrumb: Breadcrumb[] = []
breadcrumb.push({
    label: 'Home',
    link: '/',
})
breadcrumb.push({
    label: 'Blog',
    link: '/blog/',
})
breadcrumb.push({
    label: tag.label,
    link: '',
})
</script>

<template>
    <main class="max-w-5xl mx-auto p-4">
        <AtomBreadcrumb :breadcrumb="breadcrumb" />
        <section
            id="blog-list"
            class="max-w-5xl mx-auto p-4 mt-10 sm:mt-32"
        >
            <h1 class="text-4xl sm:text-6xl font-bold mb-8 text-center flex justify-center items-center">
                <span class="circle-image-wrapper border rounded-full mr-4">
                    <NuxtImg
                        :alt="tag.label + 'のアイコン'"
                        class="block bg-white w-16 h-16 p-1"
                        :src="'/uploader' + tag.icon_path"
                        width="64"
                        height="64"
                    />
                </span>
                {{ tag.label }}
            </h1>
            <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-6 mb-8 items-stretch">
                <li
                    v-for="(article, index) in articleList.articles"
                    :key="index"
                    class="h-full"
                >
                    <MoleculeBlogCard
                        :article="article"
                    />
                </li>
            </ul>
        </section>
    </main>
</template>
