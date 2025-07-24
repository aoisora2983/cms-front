<script setup lang="ts">
import dayjs from 'dayjs'
import type { Article } from '~/api/models/blog/article'
import defaultImage from '@/assets/img/no_image.jpg'
import { DATE_FORMAT } from '~/constants/constants'

interface Props {
    article: Article
    tagLimit?: number
}

const props = withDefaults(defineProps<Props>(), {
    tagLimit: 10,
})
const content = props.article.content
const publishedAt = dayjs(content.published_start_time)

const thumbnail = content.thumbnail != null ? '/uploader' + content.thumbnail : defaultImage
</script>

<template>
    <article class="border px-4 py-8 rounded bg-white h-full flex flex-col">
        <div class="h-24 flex items-center justify-center mb-2">
            <NuxtImg
                :alt="content.title + 'のサムネイル画像'"
                :src="thumbnail"
                class="h-24 w-24"
                width="96"
                height="96"
            />
        </div>
        <h2 class="text-xl font-bold mb-4">
            <NuxtLink
                :to="'/blog/page/' + content.id"
                class="hover:underline whitespace-pre-wrap"
            >
                {{ content.title }}
            </NuxtLink>
        </h2>
        <header class="text-right text-sm mb-2">
            <time :datetime="content.published_start_time">
                {{ publishedAt.format(DATE_FORMAT) }}
            </time> 掲載
        </header>
        <p class="mb-4 flex-grow">
            {{ content.description }}
        </p>
        <footer class="text-sm">
            <div class="flex mb-2">
                <ul class="flex flex-wrap gap-2 mb-2">
                    <li
                        v-for="(tag, index) in props.article.tags.slice(0, tagLimit)"
                        :key="index"
                    >
                        <AtomTag
                            :id="tag.id"
                            :label="tag.label"
                            :icon="tag.icon_path"
                        />
                    </li>
                </ul>
            </div>
            <div class="flex items-center justify-end">
                <i class="material-icons mr-1 text-lg text-pink-600">favorite</i>
                <span class="w-6 text-right">
                    {{ props.article.meta.article_good ?? 0 }}
                </span>
            </div>
        </footer>
    </article>
</template>
