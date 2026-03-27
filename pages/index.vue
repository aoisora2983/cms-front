<script setup lang="ts">
import { getOpenPortfolioList } from '~/api/apis/portfolio/getOpenPortfolioList'

const title = 'WAの技術ブログとポートフォリオサイト'
const description = 'Go、Nuxt、Flutter、PHPなどの技術ブログ。業務での経験に加え、趣味で開発した自作のオンラインツールや、技術的な学びを記録した記事、ポエムを公開しています。'

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
</script>

<template>
    <main class="w-full tracking-widest">
        <section
            id="about-this-site"
            class="bg-white"
            style="
                background-image:
                    linear-gradient(to right, transparent 5px, #d7def2 7px, transparent 7px),
                    linear-gradient(to bottom, transparent 5px, #d7def2 7px, transparent 7px);
                background-size:
                    32px 32px;
            "
        >
            <div
                class="
                    min-h-screen flex items-center max-w-5xl mx-auto py-20 bg-repeat
                    relative
                    before:border-2 before:border-gray-600
                    before:border-l-4 before:border-t-4 before:border-b-0 before:border-r-0
                    before:w-5 before:h-5 before:absolute
                    before:top-20 before:left-2
                    after:border-2 after:border-gray-600
                    after:border-l-0 after:border-t-0 after:border-b-4 after:border-r-4
                    after:w-5 after:h-5 after:absolute
                    after:bottom-40 after:right-2
                "
            >
                <div
                    class="flex-grow p-4 md:px-4 md:py-8"
                >
                    <h1 class="text-4xl sm:text-6xl font-bold mt-4 mb-10 text-center">
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
            class="bg-gray-50"
        >
            <div class="min-h-screen flex items-center mb-40 md:mb-0 max-w-5xl mx-auto py-20">
                <div class="flex-grow p-4">
                    <h2 class="text-5xl sm:text-6xl font-bold mb-4 text-center">
                        Portfolio
                    </h2>
                    <p class="mb-8 text-center">
                        作成したサービス集
                    </p>
                    <ul class="grid md:grid-cols-2 gap-4 mb-8">
                        <li
                            v-for="(portfolio, index) in portfolioList"
                            :key="index"
                        >
                            <LazyOrganismPortfolioCard
                                :portfolio="portfolio"
                                :h-level="3"
                            />
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
            </div>
        </section>
        <section
            id="blog-list"
            class="bg-white"
        >
            <div class="min-h-screen flex items-center max-w-5xl mx-auto py-20">
                <div class="flex-grow p-4">
                    <h2 class="text-5xl sm:text-6xl font-bold mb-4 text-center">
                        Blog
                    </h2>
                    <p class="mb-8 text-center">
                        技術メモやポエムなど
                    </p>
                    <LazyOrganismBlogCardList
                        :h-level="3"
                    />
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
