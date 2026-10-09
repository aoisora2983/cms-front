<script setup lang="ts">
import { getOpenArticleList } from '~/api/apis/blog/getOpenArticleList'
import { getSubSite } from '~/api/apis/subSite/getSubSite'
import type { Breadcrumb } from '~/api/models/common'

const route = useRoute()
const subdir = route.params.subdir

if (typeof subdir !== 'string' || subdir === '') {
    throw createError({
        statusCode: 404,
        statusMessage: 'Page Not Found',
    })
}

const subSite = await getSubSite({
    sub_dir_name: subdir,
})

const title = subSite.title + 'のブログ記事一覧'
const description = subSite.title + 'のブログ記事の一覧です。'

useHead({
    title: title,
    meta: [
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
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
    label: subSite.title,
    link: '',
})

const articleList = await getOpenArticleList({
    keyword: null,
    tags: [],
    id_sub_site: subSite.id,
    limit: 5,
    exclude_page_ids: [],
    page: null,
})

const articles = ref(articleList.articles)

// const keyword = ref('')

// const keydownSearch = async (event: KeyboardEvent) => {
//     if (!event) {
//         return
//     }

//     if (!event.code) {
//         return
//     }

//     if (event.code == 'Enter') {
//         onClickSearch()
//     }
// }

// const onClickSearch = async () => {
// articleList.value = {
//     articles: [],
//     total: 0,
// }
// articleList.value = await getOpenArticleList()
// }
</script>

<template>
    <main class="max-w-5xl mx-auto p-4">
        <AtomBreadcrumb :breadcrumb="breadcrumb" />
        <section
            id="blog-list"
            class="max-w-5xl mx-auto p-4 mt-8 sm:mt-30"
        >
            <h1 class="text-2xl sm:text-2xl font-bold mb-8 text-center">
                {{ subSite.title }}
            </h1>
        </section>
        <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mb-8 items-stretch">
            <li
                v-for="(item, index) in articles"
                :key="index"
            >
                <MoleculeBlogCard
                    :article="item"
                    :blog-path="'/' + subSite.subdir_name + '/'"
                />
            </li>
        </ul>
    </main>
</template>
