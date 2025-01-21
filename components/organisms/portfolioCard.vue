<script setup lang="ts">
import type { Portfolio } from '~/api/models/portfolio/portfolio'

interface Props {
    portfolio: Portfolio
}
const props = defineProps<Props>()
</script>

<template>
    <article class="p-8 border rounded h-full flex flex-col justify-between">
        <div class="md:flex justify-between mb-8">
            <div class="md:order-2 mb-4 flex items-center justify-center">
                <img
                    class="max-h-36 md:max-h-44"
                    width="144"
                    height="144"
                    :alt="props.portfolio.title + 'の画像'"
                    :src="props.portfolio.thumbnail"
                >
            </div>
            <div class="md:order-1">
                <h2 class="text-4xl font-bold mb-4">
                    {{ props.portfolio.title }}
                </h2>
                <p class="whitespace-pre-wrap">
                    {{ props.portfolio.description }}
                </p>
            </div>
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
