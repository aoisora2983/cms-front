<script setup lang="ts">
import { getOpenArticleList } from '~/api/apis/blog/getOpenArticleList'
import type { Breadcrumb } from '~/api/models/common'

const title = `ブログ記事一覧 - 備忘録・技術・ポエム等`
const description = `ブログ記事の一覧です。不具合対処の備忘録や、便利なテクニック、ポエム等を掲載しています。キーワードやタグを使って記事を絞り込んで探すこともできます。`

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
    label: 'Blog',
    link: '',
})

const keyword = ref('')

const getArticle = async () => {
    return await getOpenArticleList({
        keyword: keyword.value,
        tags: null,
        limit: null,
        page: null,
    })
}

const articleList = ref(await getArticle())

const keydownSearch = async (event: KeyboardEvent) => {
    if (!event) {
        return
    }

    if (!event.code) {
        return
    }

    if (event.code == 'Enter') {
        onClickSearch()
    }
}

const onClickSearch = async () => {
    articleList.value = {
        articles: [],
        total: 0,
    }
    articleList.value = await getArticle()
}
</script>

<template>
    <main class="max-w-5xl mx-auto p-4">
        <AtomBreadcrumb :breadcrumb="breadcrumb" />
        <section
            id="blog-list"
            class="max-w-5xl mx-auto p-4 mt-8 sm:mt-30"
        >
            <h1 class="text-4xl sm:text-6xl font-bold mb-8 text-center">
                Blog
            </h1>
            <div class="flex flex-col justify-center">
                <label
                    for="input-search-blog-keyword"
                    class="flex items-center mr-0 sm:mr-4 w-full"
                >
                    <i class="pr-2 py-2 material-icons text-2xl">search</i>
                    記事検索
                </label>
                <div class="rounded flex items-center border mb-8 border-stone-800">
                    <input
                        id="input-search-blog-keyword"
                        v-model="keyword"
                        type="text"
                        placeholder="キーワードを入力"
                        class="border-none rounded-l flex-grow w-40"
                        @keydown="keydownSearch"
                    >
                    <button
                        class="whitespace-nowrap bg-stone-600 text-white py-2 px-6 box-border border-2 border-stone-600 focus:border-2 focus:border-orange-400"
                        @click="onClickSearch"
                    >
                        検索
                    </button>
                </div>
            </div>
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
