<script setup lang="ts">
import type { Breadcrumb } from '~/api/models/common'

const config = useRuntimeConfig()
const title = 'Nuxt × Golangで作ったCMSの紹介ページ'
const description = 'フロントをNuxt、APIをGolangで作ったCMSの紹介ページ。モダンな言語を使っていて、高速かつ低学習コストで作れるのが特徴です。HTMLタグの構造化にこだわり、divタグを必要最低限にしたHTMLを出力を行うことが可能です。'

useHead({
    title: title,
    meta: [
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: config.public.imageUrl + '/img/cms_mockup.webp' },
    ],
})

useSeoMeta({
    description: description,
})

const services = [
    {
        icon: 'fiber_new',
        title: 'モダンな言語',
        description: 'モダンな言語（vue, golang）とフレームワーク（Nuxt, Gin）を使ったCMS。\n低い学習コストでカスタマイズ、高速な表示が可能です。',
    },
    {
        icon: 'css',
        title: 'Tailwind CSS',
        description: 'Tailwind CSSを使って、必要なスタイルを必要な分だけロード。\n不要な読み込みをさせません。',
    },
    {
        icon: 'wysiwyg',
        title: 'WYSIWYGエディタ',
        description: '「What You See Is What You Get (あなたが見たものが、そのまま出力できる)」なエディタ、CKEditor5を採用。\nWordライクなツールバーを使って直観的な記事の編集が可能です。',
    },
    {

        icon: 'accessibility',
        title: 'アクセシビリティチェック補助',
        description: '記事作成時にアクセシビリティチェックを行い、多くの人に記事を届けます。\nLighthouseやmiChecker等の(一部)確認の手間を省くことも可能です。',
    },
    {

        icon: 'crown',
        title: 'SEO対策',
        description: '基本的なSEO対策を搭載。\nHTML構造化や、sitemap.xml・IndexNowによるクローラー対応、リンク切れチェックと通知によるコンテンツの質の担保を行います。',
    },
]

const functions = [
    {
        thumbnail: '/img/cms_responsive.webp',
        thumbnail_alt: '記事作成画面のPC幅、スマートフォン幅のスクリーンショット。',
        title: '記事編集画面',
        description: 'レスポンシブで外出時でもスマホで更新。\nWYSIWYGエディタなので直観的に操作が可能です。',
    },
    {
        thumbnail: '/img/cms_accessibility.webp',
        thumbnail_alt: '禁止・警告の置換単語一覧を登録出来る機能の画面。',
        title: 'アクセシビリティ補助',
        description: '豊富なアクセシビリティ補助機能で、記事作成時の手動チェックを減らします。\nあらかじめ登録しておいたNGワードをチェックし、自動的に置換などが可能です。',
    },
    {
        thumbnail: '/img/cms_edit_list.webp',
        thumbnail_alt: '記事管理画面のスクリーンショット。',
        title: '絞り込み機能',
        description: 'キーワード・状態・タグ絞り込み機能によって、沢山ページがあっても簡単に管理が可能です。',
    },
]

const githubLinks = [
    {
        label: 'API',
        href: 'https://github.com/aoisora2983/cms-api',
        language: 'Go',
        framework: 'Gin',
        color: 'brightness(0) saturate(100%) invert(36%) sepia(11%) saturate(3147%) hue-rotate(174deg) brightness(96%) contrast(87%);',
    },
    {
        label: 'Front',
        href: 'https://github.com/aoisora2983/cms-front.git',
        language: 'Vue3',
        framework: 'Nuxt4',
        color: 'brightness(0) saturate(100%) invert(38%) sepia(13%) saturate(4430%) hue-rotate(131deg) brightness(99%) contrast(87%);',
    },
]

const breadcrumb: Breadcrumb[] = []
breadcrumb.push({
    label: 'Home',
    link: '/',
})
breadcrumb.push({
    label: 'Portfolio',
    link: '/portfolio/',
})
breadcrumb.push({
    label: 'CMS',
    link: '',
})
</script>

<template>
    <main>
        <div class="max-w-5xl mx-auto p-4">
            <AtomBreadcrumb :breadcrumb="breadcrumb" />
        </div>
        <section class="grid grid-cols-1 md:grid-cols-2 items-center p-4 max-w-5xl mx-auto pb-10">
            <div class="w-full p-4">
                <h1 class="text-5xl sm:text-6xl font-bold mb-10 text-center">
                    CMS
                </h1>
                <p class="text-center">
                    モダンな言語とフレームワークを使った、<br>
                    軽量で高速なCMS
                </p>
            </div>
            <div class="w-full">
                <picture>
                    <NuxtImg
                        src="/img/cms_mockup.webp"
                        alt="CMSのスクリーンショット"
                        width="1454"
                        height="965"
                    />
                </picture>
            </div>
        </section>
        <section class="p-4 pb-20 bg-stone-50">
            <div class=" mx-auto max-w-5xl">
                <h2 class="text-4xl font-bold mt-20 mb-10 text-center">
                    機能の特徴
                </h2>
                <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                    <li
                        v-for="(service, index) in services"
                        :key="index"
                    >
                        <dl class="flex flex-col h-full bg-stone-300 rounded items-center p-4">
                            <dt class="order-2 pt-2 font-bold">
                                {{ service.title }}
                            </dt>
                            <dd class="order-1 bg-white rounded-full flex items-center">
                                <i class="material-icons p-2 text-2xl">
                                    {{ service.icon }}
                                </i>
                            </dd>
                            <dd class="order-3 pt-2 whitespace-pre-wrap leading-relaxed">
                                {{ service.description }}
                            </dd>
                        </dl>
                    </li>
                </ul>
            </div>
        </section>
        <section class="pb-20">
            <h2 class="text-4xl font-bold pt-20 mb-10 text-center">
                機能紹介
            </h2>
            <ul class="py-8 overflow-x-auto flex">
                <li
                    v-for="(item, index) in functions"
                    :key="index"
                    class="px-8"
                    style="min-width: 350px; width: 600px;"
                >
                    <div class="w-full flex justify-center h-72">
                        <img
                            :src="item.thumbnail"
                            :alt="item.thumbnail_alt"
                            class="border border-gray-400 rounded"
                        >
                    </div>
                    <h3 class="text-xl font-bold pt-4 pb-2">
                        {{ item.title }}
                    </h3>
                    <p class="whitespace-pre-wrap leading-relaxed">
                        {{ item.description }}
                    </p>
                </li>
            </ul>
        </section>
        <section class="mt-10 pb-40 bg-stone-50">
            <div class="p-4 max-w-5xl mx-auto">
                <h2 class="text-4xl font-bold mt-20 mb-10 text-center">
                    関連リンク
                </h2>
                <h3 class="text-2xl font-bold text-center">
                    GitHubへのリンク
                </h3>
                <ul class="flex justify-center items-stretch gap-2 md:gap-4 py-8">
                    <li
                        v-for="(githubLink, index) in githubLinks"
                        :key="index"
                    >
                        <a
                            :href="githubLink.href"
                            target="_blank"
                            rel="noopener"
                            class="flex flex-col sm:w-60 items-center border rounded bg-white hover:bg-gray-200 relative"
                        >
                            <div class="absolute right-2 top-2">
                                <i class="material-icons text-xl text-gray-600">open_in_new</i>
                            </div>
                            <NuxtImg
                                src="/img/github_mark.svg"
                                alt="GitHubのロゴ画像"
                                width="162"
                                height="160"
                                class="p-8"
                                loading="lazy"
                                :style="'filter:' + githubLink.color"
                            />
                            <dl class="px-4 pb-8 flex flex-col justify-center">
                                <dt class="text-center text-lg">
                                    {{ githubLink.label }}
                                </dt>
                                <dd class="text-center pt-1 text-gray-600">
                                    {{ githubLink.language }} / {{ githubLink.framework }}
                                </dd>
                            </dl>
                        </a>
                    </li>
                </ul>
                <h3 class="text-2xl font-bold text-center mt-8">
                    このCMSで作ったサイト
                </h3>
                <ul class="flex justify-center gap-4 py-8">
                    <li>
                        <NuxtLink
                            href="/"
                            target="_self"
                            class="flex flex-col sm:w-60 items-center border rounded p-8 bg-white hover:bg-gray-200"
                        >
                            <AtomLogo
                                class="logo w-16"
                                :alt="config.public.siteTitle + 'のロゴ画像'"
                            />
                            <div class="mt-8">
                                My Blog
                            </div>
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </section>
    </main>
</template>
