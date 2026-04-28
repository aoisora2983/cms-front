<script setup lang="ts">
import { getOpenArticleList } from '~/api/apis/blog/getOpenArticleList'

interface Props {
    hLevel?: number
    tags?: number[] | null
    limit?: number
}

const props = withDefaults(defineProps<Props>(), {
    hLevel: 2,
    tags: null,
    limit: 12,
})

const articleList = await getOpenArticleList({
    keyword: null,
    tags: props.tags,
    limit: props.limit,
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
                :h-level="hLevel"
            />
        </li>
    </ul>
</template>
