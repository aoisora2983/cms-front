<script setup lang="ts">
import dayjs from 'dayjs'
import hljs from 'highlight.js'
import * as cheerio from 'cheerio'
import { getOpenArticle } from '~/api/apis/blog/getOpenArticle'
import '~/assets/css/article.scss'
import 'highlight.js/styles/hybrid.css'
import type { Breadcrumb } from '~/api/models/common'

const route = useRoute()
const routeId = route.params.id as string
const id = parseInt(routeId)
const article = await getOpenArticle({
    id: id,
})
const pastYear = dayjs().subtract(1, 'y')
const publishedAt = dayjs(article.content.published_start_time)
const updatedAt = dayjs(article.content.published_updated_time)

// highligh対象の内容を加工
const tmpHtml = '<body>' + article.content.content + '</body>'
const $ = cheerio.load(tmpHtml)
$('pre').each((_, elm) => {
    $(elm).find('code').each((_, code) => {
        const result = hljs.highlightAuto($(code).text()).value
        $(code).html(result)
        $(code).addClass('hljs')

        const button = $('<button class="code-copy"><i class="material-icons">copy_all</i></button>')

        $(code).closest('pre').append(button)
    })
})

const copiedOpacity = ref(0)
const clickCodeCopy = (event: PointerEvent) => {
    const target = event.currentTarget as HTMLElement
    const code = target.closest('pre')?.querySelector('.hljs')
    if (code) {
        const copiedText = code.textContent
        navigator.clipboard.writeText(copiedText).then(() => {
            copiedOpacity.value = 100
            setTimeout(function () {
                fadeoutCopied()
            }, 1000)
        })
    }
}

const fadeoutCopied = () => {
    copiedOpacity.value -= 2
    if (copiedOpacity.value > 0) {
        setTimeout(function () {
            fadeoutCopied()
        }, 10)
    }
}

onMounted(() => {
    // マウント後に要素を取得
    const copies = document.querySelectorAll('.code-copy')
    copies.forEach((copy) => {
        copy.addEventListener('click', clickCodeCopy as EventListener)
    })
})

// 見出しリストを作成
interface Head {
    fragment: string
    level: number
    label: string
    children: Array<Head>
}

const headList: Array<Head> = []
$('h2,h3').each((index, elm) => {
    const tmp = elm.name.match(/h([0-9])/)
    if (!tmp || typeof tmp[1] == 'undefined') {
        return true
    }

    const level = tmp ? parseInt(tmp[1]) : 2
    const id = 'fragment-head' + level + '-' + index
    $(elm).attr('id', id)
    const _head = {
        fragment: '#' + id,
        level: level,
        label: $(elm).text(),
        children: [],
    }
    if (level == 2) {
        headList.push(_head)
    }
    else {
        const index = headList.length - 1
        if (typeof headList[index] == 'undefined') {
            return true
        }

        headList[index].children.push(_head)
    }
})

const html = $('body').html()

const config = useRuntimeConfig()
useHead({
    title: `${article.content.title}`,
    meta: [
        { property: 'og:title', content: article.content.title },
        { property: 'og:description', content: article.content.description },
        { property: 'og:image', content: config.public.imageUrl + article.content.thumbnail },
    ],
})
useSeoMeta({
    description: `${article.content.description}`,
})

const breadcrumb: Breadcrumb[] = []
breadcrumb.push({
    label: 'Home',
    link: '/',
})
breadcrumb.push({
    label: 'Blog',
    link: '/blog/',
})
breadcrumb.push({
    label: article.content.title,
    link: '',
})

const tags = article.tags.map(function (item) {
    return item.id
})
</script>

<template>
    <main class="max-w-4xl mx-auto p-4">
        <AtomBreadcrumb :breadcrumb="breadcrumb" />
        <div
            v-if="publishedAt.isBefore(pastYear)"
            class="py-8"
        >
            <p class="flex my-4 p-4 rounded border border-red-600 bg-red-100 justify-center items-center">
                <i class="material-icons mr-2 text-2xl">warning</i>
                <strong>
                    この記事は最終更新日から1年以上が経過しています。
                </strong>
            </p>
        </div>
        <article class="break-words mt-2 mb-2 px-1 relative">
            <h1 class="text-4xl mt-8 font-bold text-center mb-4 whitespace-pre-wrap">
                {{ article.content.title }}
            </h1>
            <ul
                id="tag-list"
                class="flex flex-wrap justify-center text-center mb-4 gap-2"
            >
                <li
                    v-for="(tag, index) in article.tags"
                    :key="index"
                >
                    <AtomTag
                        :id="tag.id"
                        :label="tag.label"
                        :icon="tag.icon_path"
                    />
                </li>
            </ul>
            <div
                id="publish-info"
                class="mb-4"
            >
                <dl class="flex justify-end">
                    <dt>掲載日</dt>
                    <dd class="ml-2">
                        <time :datetime="article.content.published_start_time">
                            {{ publishedAt.format('YYYY年 MM月 DD日') }}
                        </time>
                    </dd>
                </dl>
                <dl
                    v-if="publishedAt.format('YYYY年 MM月 DD日') !== updatedAt.format('YYYY年 MM月 DD日')"
                    class="flex justify-end"
                >
                    <dt>更新日</dt>
                    <dd class="ml-2">
                        <time :datetime="article.content.published_updated_time">
                            {{ updatedAt.format('YYYY年 MM月 DD日') }}
                        </time>
                    </dd>
                </dl>
            </div>
            <div
                class="flex flex-col"
            >
                <AtomTableOfContent
                    :head-list="headList"
                    :is-open="true"
                />
                <div>
                    <!-- eslint-disable vue/no-v-html -->
                    <section
                        id="blog-article"
                        class="mb-4 py-4 md:px-4 leading-loose"
                        v-html="html"
                    />
                    <div class="sticky w-full z-10 bottom-4 flex justify-end mb-4">
                        <AtomTableOfContent
                            :head-list="headList"
                            :is-open="false"
                        />
                    </div>
                </div>
            </div>
            <!-- eslint-enable -->
            <ul class="flex justify-end items-center mb-4 gap-2">
                <li>
                    <AtomArticleCountUpButton
                        :id="id"
                        :good="article.meta.article_good"
                    />
                </li>
                <li>
                    <AtomShareButton />
                </li>
            </ul>
            <div id="profile">
                <OrganismProfile
                    :author="article.content.user_name"
                    :description="article.content.user_description"
                    :thumbnail="article.content.user_icon_path"
                />
            </div>
        </article>
        <section
            id="comment"
            class="my-10 p-4 border border-gray-300 rounded"
        >
            <h2 class="pb-2 text-xl">
                Comment
            </h2>
            <LazyOrganismCommentList
                v-if="article.comments != null"
                :article-id="id"
                :comments="article.comments"
            />
            <LazyMoleculeCommentInput
                :article-id="id"
                :replay-id="0"
            />
        </section>

        <section class="bg-gray-100 p-8 rounded">
            <h2 class="pb-2 text-2xl text-center font-bold border-b border-b-gray-800 mb-4">
                関連記事
            </h2>
            <LazyOrganismBlogCardList
                :h-level="3"
                :tags="tags"
                :limit="3"
            />
        </section>

        <div
            :style="'opacity: ' + copiedOpacity + '%'"
            class="fixed bottom-10 left-0 right-0 flex justify-center"
        >
            <p
                class="w-max text-white py-2 px-4 rounded bg-gray-700 text-center flex items-center"
            >
                <i class="material-icons mr-2 text-xl">check</i>
                コピーしました！
            </p>
        </div>
    </main>
</template>
