<script setup lang="ts">
import dayjs from 'dayjs'
import { getArticleList } from '~/api/apis/blog/getArticleList'
import { getTagList } from '~/api/apis/blog/getTagList'
import { removeArticle } from '~/api/apis/blog/removeArticle'
import type { Articles } from '~/api/models/blog/article'
import { ARTICLE_STATUSES, DATETIME_FORMAT } from '~/constants/constants'

definePageMeta({ layout: 'admin' })

const confirmModal = useConfirmModal()
const loading = useLoading()
const articles = ref({} as Articles)
const headers = {
    id: 'ID-枝番',
    title: 'タイトル',
    tag: 'タグ',
    published_time: '公開期間',
    status: '状態',
    author: '作者',
    action: '',
}

const isAllSelected = ref(false)
const checkedIds = ref([] as string[])
const checkedTagIds = ref([] as number[])
const checkedStatuses = ref([] as number[])
const searchKeyword = ref('')
const checkedSearchAccordion = ref(true)
const pageLimit = ref(10)
const nowPageNo = ref(0)

const responsiveClass = 'flex text-center before:px-2 before:py-4  before:text-center before:font-bold before:w-2/5 before:content-[attr(data-label)] md:before:hidden md:table-cell'

const getArticles = async () => {
    let data = {} as Articles
    try {
        data = await getArticleList({
            keyword: searchKeyword.value,
            statuses: checkedStatuses.value,
            tags: checkedTagIds.value,
            limit: pageLimit.value,
            page: nowPageNo.value,
        })
    }
    catch (error) {
        console.log(error)
    }

    return data
}

const data: Articles = await getArticles()
articles.value = data
const tags = await getTagList()

const getIds = () => {
    const ids = []

    for (const id in articles.value.articles) {
        for (const branch in articles.value.articles[id]) {
            ids.push(id + '-' + branch)
        }
    }

    return ids
}

const onClickAllArticleCheck = () => {
    if (isAllSelected.value) {
        checkedIds.value = getIds()
    }
    else {
        checkedIds.value = []
    }
}

const onClickRemove = () => {
    const message = 'ID-枝番「'
        + checkedIds.value.join(', ')
        + '」を削除します。<br>よろしいですか？'
    confirmModal.open(message, removeArticles)
}

const onClickTr = (id: number | null, branch: number | null) => {
    const value = id + '-' + branch
    const index = checkedIds.value.indexOf(value)
    if (index >= 0) {
        checkedIds.value.splice(index, 1)
    }
    else {
        checkedIds.value.push(value)
    }
}

const removeArticles = async () => {
    loading.load()
    try {
        await removeArticle({
            id_branch: checkedIds.value,
        })
    }
    catch (error) {
        console.log(error)
    }
    finally {
        const data = await getArticles()
        articles.value = data
        confirmModal.close()
        loading.unload()
    }
}

const checkedTag = (id: number) => {
    return checkedTagIds.value.includes(id)
}

const reloadArticle = async () => {
    loading.load()

    try {
        const data: Articles = await getArticles()
        articles.value = data
    }
    catch (error) {
        console.log(error)
    }

    loading.unload()
}

const reSearch = async () => {
    nowPageNo.value = 0
    reloadArticle()
}

const onClickPagerPrev = async () => {
    nowPageNo.value--
    reloadArticle()
}

const onClickPagerNext = async () => {
    nowPageNo.value++
    reloadArticle()
}

const onClickPager = async (pageNo: number) => {
    nowPageNo.value = pageNo - 1
    reloadArticle()
}

useHead({
    title: 'ページ一覧',
})
</script>

<template>
    <main class="max-w-7xl mx-auto w-full p-4">
        <OrganismBlogEditHeader />
        <div class="bg-white rounded">
            <div
                class="p-4 my-4 hover:bg-gray-200"
                :class="checkedSearchAccordion ? '' : 'bg-gray-200'"
            >
                <input
                    id="search-accordion"
                    v-model="checkedSearchAccordion"
                    type="checkbox"
                    name="search-accordion"
                    class="hidden"
                >
                <label
                    for="search-accordion"
                    class="flex justify-center "
                >
                    <div class="flex">
                        <p>
                            記事を絞り込む
                        </p>
                        <i
                            v-if="checkedSearchAccordion"
                            class="material-icons text-2xl mr-2"
                        >
                            add
                        </i>
                        <i
                            v-if="!checkedSearchAccordion"
                            class="material-icons text-2xl mr-2"
                        >
                            remove
                        </i>
                    </div>
                </label>
            </div>

            <div
                :class="checkedSearchAccordion ? 'hidden' : ''"
                class="p-4 pt-0 mb-4"
            >
                <div class="grid md:grid-cols-2">
                    <div>
                        <header class="m-4 font-bold">
                            キーワード検索
                        </header>
                        <div class="rounded flex items-center border m-4 mb-8 border-stone-800 max-w-80">
                            <input
                                v-model="searchKeyword"
                                type="text"
                                name="keyword"
                                class="border-none rounded-l flex-grow w-40"
                                placeholder="キーワードを入力"
                            >
                            <button
                                class="whitespace-nowrap bg-stone-600 text-white py-2 px-6 box-border border-2 border-stone-600 focus:border-2 focus:border-orange-400"
                                @click="reSearch"
                            >
                                検索
                            </button>
                        </div>
                    </div>
                    <div>
                        <header class="m-4 font-bold">
                            公開状態
                        </header>
                        <ul class="m-4 flex gap-4">
                            <li
                                v-for="(status, index) in ARTICLE_STATUSES"
                                :key="index"
                                class="flex items-center gap-2"
                            >
                                <input
                                    :id="'status-' + status.id"
                                    v-model="checkedStatuses"
                                    type="checkbox"
                                    name="filter-status"
                                    :value="status.id"
                                    @change="reSearch"
                                >
                                <label :for="'status-' + status.id">
                                    {{ status.label }}
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>

                <header class="m-4 font-bold">
                    タグ絞り込み
                </header>
                <ul class="flex flex-wrap gap-y-3 m-4">
                    <li
                        v-for="(tag, index) in tags"
                        :key="index"
                        class="flex items-center"
                    >
                        <input
                            :id="'tag-' + index"
                            v-model="checkedTagIds"
                            :value="tag.id"
                            name="filter-tag"
                            type="checkbox"
                            class="hidden"
                            @change="reSearch"
                        >
                        <label
                            :for="'tag-' + index"
                            :class="checkedTag(tag.id) ? '' : 'opacity-50'"
                            class="px-2"
                        >
                            <AtomTag
                                :id="tag.id"
                                :label="tag.label"
                                :icon="tag.icon_path"
                                :disable-link="true"
                            />
                        </label>
                    </li>
                </ul>
            </div>
        </div>
        <section class="bg-white rounded p-4 my-4">
            <h1 class="mb-4 font-bold text-xl text-center">
                ページ一覧
            </h1>
            <ul class="flex items-center justify-center gap-4 mb-4">
                <li>
                    <button
                        :disabled="nowPageNo == 0"
                        :class="nowPageNo == 0 ? 'opacity-30' : ''"
                        @click="onClickPagerPrev()"
                    >
                        <i
                            class="material-icons text-2xl mr-2"
                        >
                            keyboard_arrow_left
                        </i>
                    </button>
                </li>
                <li
                    v-for="pageNo in Math.ceil(articles.total / 10)"
                    :key="pageNo"
                >
                    <button
                        :class="(pageNo - 1) == nowPageNo ? 'bg-gray-200' : ''"
                        class="px-4 py-2 border border-gray-600 rounded hover:bg-gray-200"
                        @click="onClickPager(pageNo)"
                    >
                        {{ pageNo }}
                    </button>
                </li>
                <li>
                    <button
                        :disabled="nowPageNo == (Math.ceil(articles.total / 10) - 1)"
                        :class="nowPageNo == (Math.ceil(articles.total / 10) - 1) ? 'opacity-30' : ''"
                        @click="onClickPagerNext()"
                    >
                        <i
                            class="material-icons text-2xl mr-2"
                        >
                            keyboard_arrow_right
                        </i>
                    </button>
                </li>
            </ul>
            <div class="flex justify-end items-center">
                <NuxtLink
                    to="/manage/blog/page/0-0"
                    class="bg-blue-700 text-white hover:opacity-60 focus:ring-4 focus:ring-gray-300 rounded px-5 py-2.5 me-2 mb-2 flex justify-start items-center"
                >
                    <i class="material-icons text-xl mr-2">add</i>
                    <span>
                        新規
                    </span>
                </NuxtLink>
                <button
                    name="remove"
                    class="bg-red-600 text-white hover:opacity-80 focus:ring-4 focus:ring-gray-300 rounded px-5 py-2.5 me-2 mb-2 flex items-center justify-center"
                    @click="onClickRemove"
                >
                    <i class="material-icons mr-2 text-2xl">delete</i>
                    <span>削除</span>
                </button>
            </div>
            <div class="border rounded">
                <table
                    class="w-full"
                >
                    <thead class="border-b-2 border-black hidden md:table-header-group">
                        <tr class="bg-gray-200">
                            <th class="py-4">
                                <label class="p-4 w-full">
                                    <input
                                        v-model="isAllSelected"
                                        :value="true"
                                        type="checkbox"
                                        @change="onClickAllArticleCheck"
                                    >
                                </label>
                            </th>
                            <th
                                v-for="(header, id) in headers"
                                :key="id"
                            >
                                {{ header }}
                            </th>
                        </tr>
                    </thead>
                    <tbody
                        v-if="articles.total == 0"
                    >
                        <tr>
                            <td
                                class="text-center py-4 px-2"
                                colspan="7"
                            >
                                ページが存在しません。「新規」ボタンをクリックして新たにページを作成してください。
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <template
                            v-for="(branchArticles, idIndex) in articles.articles"
                            :key="idIndex"
                        >
                            <tr
                                v-for="(article, branchIndex) in branchArticles"
                                :key="branchIndex"
                                :class="idIndex % 2 == 0 ? 'bg-gray-100' : ''"
                                class="flex flex-col md:table-row hover:bg-gray-200"
                                @click="onClickTr(article.content.id, article.content.id_branch)"
                            >
                                <td
                                    class="bg-black text-center md:bg-transparent w-full md:w-auto"
                                >
                                    <label class="w-full p-2 md:py-4 text-center block">
                                        <input
                                            v-model="checkedIds"
                                            name="article"
                                            :value="article.content.id + '-' + article.content.id_branch"
                                            type="checkbox"
                                        >
                                    </label>
                                </td>
                                <td
                                    :data-label="headers.id"
                                    :class="responsiveClass"
                                >
                                    <span class="px-2 py-4">
                                        {{ article.content.id }} - {{ article.content.id_branch }}
                                    </span>
                                </td>
                                <td
                                    :data-label="headers.title"
                                    :class="responsiveClass + ' md:w-40 md:p-4'"
                                >
                                    <span class="px-2 py-4 whitespace-pre-wrap">
                                        {{ article.content.title }}
                                    </span>
                                </td>
                                <td
                                    :data-label="headers.tag"
                                    :class="responsiveClass"
                                >
                                    <ul class="flex flex-col items-start">
                                        <li
                                            v-for="(tag, index) in article.tags"
                                            :key="index"
                                            class="px-1 py-1 pointer-events-none"
                                        >
                                            <AtomTag
                                                :id="tag.id"
                                                :label="tag.label"
                                                :icon="tag.icon_path"
                                            />
                                        </li>
                                    </ul>
                                </td>
                                <td
                                    :data-label="headers.published_time"
                                    :class="responsiveClass"
                                >
                                    <span class="px-2 py-4 md:flex md:flex-col">
                                        <span>
                                            {{ dayjs(article.content.published_start_time).format(DATETIME_FORMAT) }}
                                        </span>
                                        <span>
                                            ～
                                        </span>
                                        <span>
                                            {{
                                                article.content.published_end_time
                                                    ? dayjs(article.content.published_end_time).format(DATETIME_FORMAT)
                                                    : "無期限"
                                            }}
                                        </span>
                                    </span>
                                </td>
                                <td
                                    :data-label="headers.status"
                                    :class="responsiveClass"
                                >
                                    <span class="px-2 py-4">
                                        {{ article.content.status.label }}
                                    </span>
                                </td>
                                <td
                                    :data-label="headers.author"
                                    :class="responsiveClass"
                                >
                                    <span class="px-2 py-4">
                                        {{ article.content.user_name }}
                                    </span>
                                </td>
                                <td
                                    :data-label="headers.action"
                                    class="py-4"
                                >
                                    <div
                                        class="w-full flex justify-evenly md:flex"
                                    >
                                        <NuxtLink
                                            :to="'/manage/blog/page/' + article.content.id + '-' + article.content.id_branch + '-modify'"
                                            class="px-4 py-2 text-white bg-blue-700 rounded flex justify-start items-center hover:opacity-60"
                                        >
                                            <i class="material-icons text-xl mr-2">edit</i>
                                            <span>
                                                修正
                                            </span>
                                        </NuxtLink>
                                        <NuxtLink
                                            :to="'/manage/blog/page/' + article.content.id + '-' + article.content.id_branch + '-copy'"
                                            class="px-4 py-2 text-white bg-blue-700 rounded flex justify-start items-center hover:opacity-60"
                                        >
                                            <i class="material-icons text-xl mr-2">content_copy</i>
                                            <span>
                                                複製
                                            </span>
                                        </NuxtLink>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </section>
    </main>
</template>
