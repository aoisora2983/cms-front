<script setup lang="ts">
import { getOpenArticleList } from '~/api/apis/blog/getOpenArticleList'

const articleList = await getOpenArticleList({
    keyword: null,
    tags: null,
    limit: 12,
    page: null,
})
</script>

<template>
    <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mb-8 items-stretch">
        <li
            v-for="(article, index) in articleList.articles"
            :key="index"
        >
            <MoleculeBlogCard
                :article="article"
                :tag-limit="2"
            />
        </li>
    </ul>
</template>
