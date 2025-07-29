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
const updatedAt = dayjs(article.content.published_update_time)

// highligh対象の内容を加工
const tmpHtml = '<body>' + article.content.content + '</body>'
const $ = cheerio.load(tmpHtml)
$('code').each((_, elm) => {
    const result = hljs.highlightAuto($(elm).text()).value
    $(elm).html(result)
    $(elm).addClass('hljs')
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
        headList[headList.length - 1].children.push(_head)
    }
})

const html = $('body').html()

useHead({
    title: `${article.content.title}`,
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
                <dl class="flex justify-end">
                    <dt>更新日</dt>
                    <dd class="ml-2">
                        <time :datetime="article.content.published_update_time">
                            {{ updatedAt.format('YYYY年 MM月 DD日') }}
                        </time>
                    </dd>
                </dl>
            </div>
            <AtomTableOfContent :head-list="headList" />
            <!-- eslint-disable vue/no-v-html -->
            <section
                id="blog-article"
                class="mb-4 py-4 md:px-4 leading-loose"
                v-html="html"
            />
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
            <OrganismCommentList
                v-if="article.comments != null"
                :article-id="id"
                :comments="article.comments"
            />
            <MoleculeCommentInput
                :article-id="id"
                :replay-id="0"
            />
        </section>
    </main>
</template>
