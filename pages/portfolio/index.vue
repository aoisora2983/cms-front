<script setup lang="ts">
import { getOpenPortfolioList } from '~/api/apis/portfolio/getOpenPortfolioList'
import type { Breadcrumb } from '~/api/models/common'

const title = '作成したシステムやサービス（ポートフォリオ）一覧ページ'
const description = '作成したシステムやサービス（ポートフォリオ）の一覧ページです。新しい制作物ができ次第追加予定。'

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

const portfolioList = await getOpenPortfolioList()

const breadcrumb: Breadcrumb[] = []
breadcrumb.push({
    label: 'Home',
    link: '/',
})
breadcrumb.push({
    label: 'Portfolio',
    link: '/portfolio/',
})
</script>

<template>
    <main class="max-w-5xl mx-auto p-4">
        <AtomBreadcrumb :breadcrumb="breadcrumb" />
        <section
            id="blog-list"
            class="max-w-5xl mx-auto p-4 mt-10 sm:mt-30"
        >
            <h1 class="text-4xl sm:text-6xl font-bold mb-8 text-center">
                Portfolio
            </h1>
            <ul class="grid grid-cols-1 gap-4 mb-8 items-stretch">
                <li
                    v-for="(portfolio, index) in portfolioList"
                    :key="index"
                    class="h-full"
                >
                    <OrganismPortfolioCard
                        :portfolio="portfolio"
                    />
                </li>
            </ul>
        </section>
    </main>
</template>
