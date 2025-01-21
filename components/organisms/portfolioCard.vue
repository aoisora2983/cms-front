<script setup lang="ts">
import type { Portfolio } from '~/api/models/portfolio/portfolio'

interface Props {
    portfolio: Portfolio
}
const props = defineProps<Props>()
</script>

<template>
    <article class="p-8 border rounded h-full flex flex-col justify-between">
        <div class="mb-8">
            <div class="mb-2 flex items-center justify-center">
                <NuxtImg
                    :alt="props.portfolio.title + 'の画像'"
                    :src="'/uploader' + props.portfolio.thumbnail"
                    width="1454"
                    height="965"
                />
            </div>
            <h2 class="text-center text-4xl font-bold mb-4">
                {{ props.portfolio.title }}
            </h2>
            <p class="whitespace-pre-wrap">
                {{ props.portfolio.description }}
            </p>
        </div>
        <div class="text-center w-full">
            <AtomLinkButton
                :href="props.portfolio.detail_url"
                label="More Detail"
                color="white"
                bg-color="black"
            />
        </div>
    </article>
</template>
