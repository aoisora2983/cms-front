<script setup lang="ts">
import dayjs from 'dayjs'
import { getArticleList } from '~/api/apis/blog/getArticleList'
import { removeArticle } from '~/api/apis/blog/removeArticle'
import type { Articles } from '~/api/models/blog/article'
import { DATETIME_FORMAT } from '~/constants/constants'

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

const responsiveClass = 'flex text-center before:px-2 before:py-4  before:text-center before:font-bold before:w-2/5 before:content-[attr(data-label)] md:before:hidden md:table-cell'

const getArticles = async () => {
    let data = {} as Articles
    try {
        data = await getArticleList({
            keyword: null,
            categories: null,
            tags: null,
            limit: null,
            page: null,
        })
    }
    catch (error) {
        console.log(error)
    }

    return data
}

const data: Articles = await getArticles()
articles.value = data

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

useHead({
    title: 'ページ一覧',
})
</script>

<template>
    <main class="max-w-7xl mx-auto w-full p-4">
        <OrganismBlogEditHeader />
        <div class="bg-white rounded p-4 my-4">
            検索枠
        </div>
        <section class="bg-white rounded p-4 my-4">
            <h1 class="mb-4 font-bold text-xl text-center">
                ページ一覧
            </h1>
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
                                    :class="responsiveClass"
                                >
                                    <span class="px-2 py-4">
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
                                    <span class="px-2 py-4">
                                        {{ dayjs(article.content.published_start_time).format(DATETIME_FORMAT) }}
                                        ～
                                        {{
                                            article.content.published_end_time
                                                ? dayjs(article.content.published_end_time).format(DATETIME_FORMAT)
                                                : "無期限"
                                        }}
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
