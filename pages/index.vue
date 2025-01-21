<script setup lang="ts">
import { getOpenArticleList } from '~/api/apis/blog/getOpenArticleList'
import { getOpenPortfolioList } from '~/api/apis/portfolio/getOpenPortfolioList'

useHead({
    link: [
        {
            rel: 'canonical',
            href: useRequestURL().protocol + '//' + useRequestURL().host,
        },
    ],
})

const portfolioList = await getOpenPortfolioList()

const articleList = await getOpenArticleList({
    keyword: null,
    tags: null,
    limit: 10,
    page: null,
})
</script>

<template>
    <main class="w-full">
        <section
            id="about-this-site"
            class="bg-gray-50"
        >
            <div class="min-h-screen flex items-center max-w-5xl mx-auto py-20">
                <div class="flex-grow p-4">
                    <h1 class="text-4xl sm:text-6xl font-bold mb-4 text-center">
                        このサイトについて
                    </h1>
                    <p class="mb-8 text-left sm:text-center">
                        ポートフォリオサイト兼学んだことのアウトプットブログサイトです。<br>
                        業務では主にPHPを扱い、趣味ではGo、Nuxt、Flutterを勉強しています。<br>
                    </p>
                </div>
            </div>
        </section>
        <section
            id="portfolio-list"
            class="min-h-screen flex items-center mb-40 md:mb-0 max-w-5xl mx-auto py-20"
        >
            <div class="flex-grow p-4">
                <h1 class="text-5xl sm:text-6xl font-bold mb-4 text-center">
                    Portfolio
                </h1>
                <p class="mb-8 text-center">
                    作成したサービス集
                </p>
                <ul class="grid md:grid-cols-2 gap-4 mb-8">
                    <li
                        v-for="(portfolio, index) in portfolioList"
                        :key="index"
                    >
                        <OrganismPortfolioCard :portfolio="portfolio" />
                    </li>
                </ul>
                <div class="flex justify-center w-full">
                    <AtomLinkButton
                        href="/portfolio"
                        label="More Detail"
                        color="black"
                        bg-color="white"
                        class="w-full"
                    />
                </div>
            </div>
        </section>
        <section
            id="blog-list"
            class="bg-gray-50"
        >
            <div class="min-h-screen flex items-center max-w-5xl mx-auto py-20">
                <div class="flex-grow p-4">
                    <h1 class="text-5xl sm:text-6xl font-bold mb-4 text-center">
                        Blog
                    </h1>
                    <p class="mb-8 text-center">
                        技術メモやポエムなど
                    </p>
                    <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mb-8 items-stretch">
                        <li
                            v-for="(article, index) in articleList.articles"
                            :key="index"
                        >
                            <OrganismBlogCard
                                :article="article"
                                :tag-limit="2"
                            />
                        </li>
                    </ul>
                    <AtomLinkButton
                        href="/blog"
                        label="More Detail"
                        color="black"
                    />
                </div>
            </div>
        </section>
    </main>
</template>
