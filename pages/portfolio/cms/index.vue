<script setup lang="ts">
import type { Breadcrumb } from '~/api/models/common'

const config = useRuntimeConfig()

useHead({
    title: 'CMS',
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
]

const githubLinks = [
    {
        label: 'API',
        href: 'https://github.com/aoisora2983/cms-api',
        language: 'Go',
        framework: 'Gin',
    },
    {
        label: 'Front',
        href: 'https://github.com/aoisora2983/cms-front.git',
        language: 'Vue3',
        framework: 'Nuxt3',
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
    link: '/portfolio/cms',
})
</script>

<template>
    <main>
        <div class="max-w-5xl mx-auto p-4">
            <AtomBreadcrumb :breadcrumb="breadcrumb" />
        </div>
        <section class="grid grid-cols-1 md:grid-cols-2 items-center p-4 max-w-5xl mx-auto">
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
        <section class="p-4 max-w-5xl mx-auto">
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
        </section>
        <section class="mt-20 pb-40 bg-stone-50">
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
