<script setup lang="ts">
import type { Portfolio } from '~/api/models/portfolio/portfolio'

interface Props {
    portfolio: Portfolio
    hLevel?: number
}

withDefaults(defineProps<Props>(), {
    hLevel: 2,
})
</script>

<template>
    <article class="p-8 border rounded h-full flex flex-col justify-between">
        <div class="mb-8">
            <div class="mb-2 flex items-center justify-center">
                <NuxtImg
                    :alt="portfolio.title + 'の画像'"
                    :src="'/uploader' + portfolio.thumbnail"
                    width="1454"
                    height="965"
                />
            </div>
            <component
                :is="'h' + hLevel"
                class="text-center text-4xl font-bold mb-4"
            >
                {{ portfolio.title }}
            </component>
            <p class="whitespace-pre-wrap">
                {{ portfolio.description }}
            </p>
        </div>
        <div class="text-center w-full">
            <AtomLinkButton
                :href="portfolio.detail_url"
                label="More Detail"
                color="white"
                bg-color="black"
            />
        </div>
    </article>
</template>
