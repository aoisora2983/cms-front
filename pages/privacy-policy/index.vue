<script setup lang="ts">
import dayjs from 'dayjs'
import { getUniqueArticle } from '~/api/apis/blog/getUniqueArticle'
import type { Breadcrumb } from '~/api/models/common'
import { PRIVACY_POLICY } from '~/constants/constants'
import '~/assets/css/article.scss'

const article = await getUniqueArticle({
    page_type: PRIVACY_POLICY,
})

useHead({
    title: `${article.title}`,
    meta: [
        { property: 'og:title', content: article.title },
        { property: 'og:description', content: article.description },
    ],
})

useSeoMeta({
    description: article.description,
})

const breadcrumb: Breadcrumb[] = []
breadcrumb.push({
    label: 'Home',
    link: '/',
})
breadcrumb.push({
    label: article.title,
    link: '',
})

const publishedAt = dayjs(article.published_start_time)
const updatedAt = dayjs(article.published_updated_time)
</script>

<template>
    <main class="max-w-4xl mx-auto p-4">
        <AtomBreadcrumb :breadcrumb="breadcrumb" />
        <article class="break-words mt-2 mb-2 px-1 relative">
            <div
                id="publish-info"
                class="mb-4"
            >
                <dl class="flex justify-end">
                    <dt>制定日</dt>
                    <dd class="ml-2">
                        <time :datetime="article.published_start_time">
                            {{ publishedAt.format('YYYY年 MM月 DD日') }}
                        </time>
                    </dd>
                </dl>
                <dl
                    v-if="publishedAt.format('YYYY年 MM月 DD日') !== updatedAt.format('YYYY年 MM月 DD日')"
                    class="flex justify-end"
                >
                    <dt>改定日</dt>
                    <dd class="ml-2">
                        <time :datetime="article.published_updated_time">
                            {{ updatedAt.format('YYYY年 MM月 DD日') }}
                        </time>
                    </dd>
                </dl>
            </div>
            <h1 class="text-4xl mt-8 font-bold text-center mb-4 whitespace-pre-wrap">
                {{ article.title }}
            </h1>
            <section
                id="blog-article"
                class="mb-4 py-4 md:px-4 leading-loose"
                v-html="article.content"
            />
        </article>
    </main>
</template>
