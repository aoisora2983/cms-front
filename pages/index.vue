<script setup lang="ts">
import { getOpenTagList } from '~/api/apis/blog/getOpenTagList'
import { getOpenPortfolioList } from '~/api/apis/portfolio/getOpenPortfolioList'

const { addJsonLd } = useJsonLd()

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

const tagList = await getOpenTagList({
    id_sub_site: 0,
})

const config = useRuntimeConfig()
addJsonLd({
    '@type': 'WebSite',
    'url': config.public.siteTitle,
    'name': title,
    'potentialAction': {
        '@type': 'SearchAction',
        'target': config.public.siteUrl + '/search?q={search_term}',
        'query-input': 'required name=search_term',
    },
})
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
                class="flex items-center max-w-5xl mx-auto pt-14 pb-8 bg-repeat"
            >
                <div
                    class="flex-grow p-4 md:px-4 md:py-8"
                >
                    <p class="mb-8 text-center">
                        PHP・Go・Nuxt等を勉強しているエンジニアの技術ブログ・ポートフォリオ
                    </p>
                    <h1 class="text-2xl sm:text-4xl font-bold mt-4 mb-10 text-center">
                        WA
                    </h1>
                </div>
            </div>
        </section>
        <section
            id="blog-list"
            class="bg-gray-50"
        >
            <div class="min-h-screen flex items-center max-w-5xl mx-auto py-20">
                <div class="flex-grow p-4 min-w-0 flex-1">
                    <h2 class="text-2xl sm:text-4xl font-bold mb-4 text-center">
                        Blog
                    </h2>
                    <p class="mb-8 text-center">
                        技術記事など
                    </p>
                    <ul
                        class="flex w-full max-w-full flex-nowrap items-center gap-2 overflow-x-auto whitespace-nowrap mb-4 pr-8 [mask-image:linear-gradient(to_right,#000_88%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,#000_88%,transparent_100%)]"
                    >
                        <li
                            v-for="(tag, index) in tagList"
                            :key="index"
                            class="shrink-0"
                        >
                            <AtomTag
                                :id="tag.id"
                                :label="tag.label"
                                :icon="tag.icon_path"
                            />
                        </li>
                    </ul>
                    <LazyOrganismBlogCardList
                        :h-level="3"
                        :limit="6"
                        :display-description="false"
                    />
                    <AtomLinkButton
                        href="/blog"
                        label="すべての記事一覧をみる"
                        color="black"
                    />
                </div>
            </div>
        </section>
        <section
            id="portfolio-list"
            class="bg-white"
        >
            <div class="min-h-screen flex items-center mb-40 md:mb-0 max-w-5xl mx-auto py-20">
                <div class="flex-grow p-4">
                    <h2 class="text-2xl sm:text-4xl font-bold mb-4 text-center">
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
                            label="制作実績一覧をみる"
                            color="black"
                            bg-color="white"
                            class="w-full"
                        />
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>
