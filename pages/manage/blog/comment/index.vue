<script setup lang="ts">
import { approveComment } from '~/api/apis/blog/approveComment'
import { deleteComment } from '~/api/apis/blog/deleteComment'
import { getCommentList } from '~/api/apis/blog/getCommentList'
import type { Comment } from '~/api/models/blog/comment'
import { COMMENT_STATUSES } from '~/constants/constants'

definePageMeta({ layout: 'admin' })

const loading = useLoading()
const infoModal = useInfoModal()

const responsiveClass = 'flex text-center before:px-2 before:py-4  before:text-center before:font-bold before:w-2/5 before:content-[attr(data-label)] md:before:hidden md:table-cell'
const headers = {
    id: 'ID',
    status: '承認状況',
    userName: 'UserName',
    idBlogContent: 'コメント先',
    comment: 'コメント',
}

const getComments = async () => {
    let data = [] as Comment[]
    try {
        data = await getCommentList()
    }
    catch (error) {
        console.log(error)
    }

    return data
}

const comments = ref(await getComments())

const isAllSelected = ref(false)
const checkedIds = ref([] as number[])

const getIds = () => {
    const ids = []

    for (const index in comments.value) {
        ids.push(comments.value[index].id)
    }

    return ids
}

const convertStatus = (statusId: number) => {
    const status = COMMENT_STATUSES.find(status => status.id == statusId)
    return status ? status.label : '不明なステータス'
}

const onClickApprove = async () => {
    if (checkedIds.value.length == 0) {
        infoModal.open('一個以上コメントを選択してください。', function () {
            return
        })
        return
    }

    loading.load()
    try {
        await approveComment({
            ids: checkedIds.value,
        })

        comments.value = await getComments()
    }
    catch (error) {
        console.log(error)
    }
    finally {
        loading.unload()
    }
}

const onClickRemove = async () => {
    if (checkedIds.value.length == 0) {
        infoModal.open('一個以上コメントを選択してください。', function () {
            return
        })
        return
    }

    loading.load()
    try {
        await deleteComment({
            ids: checkedIds.value,
        })

        comments.value = await getComments()
    }
    catch (error) {
        console.log(error)
    }
    finally {
        loading.unload()
    }
}

const onClickAllCommentCheck = () => {
    if (isAllSelected.value) {
        checkedIds.value = getIds()
    }
    else {
        checkedIds.value = []
    }
}

const onClickTr = (id: number) => {
    const index = checkedIds.value.indexOf(id)
    if (index >= 0) {
        checkedIds.value.splice(index, 1)
    }
    else {
        checkedIds.value.push(id)
    }
}

useHead({
    title: 'コメント管理',
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
                コメント一覧
            </h1>
            <div class="flex justify-end items-center">
                <button
                    name="approve"
                    class="bg-blue-700 text-white hover:opacity-80 focus:ring-4 focus:ring-gray-300 rounded px-5 py-2.5 me-2 mb-2 flex items-center justify-center"
                    @click="onClickApprove"
                >
                    <i class="material-icons mr-2 text-2xl">check_circle</i>
                    <span>承認</span>
                </button>
                <button
                    name="remove"
                    class="bg-red-600 text-white hover:opacity-80 focus:ring-4 focus:ring-gray-300 rounded px-5 py-2.5 me-2 mb-2 flex items-center justify-center"
                    @click="onClickRemove"
                >
                    <i class="material-icons mr-2 text-2xl">delete</i>
                    <span>削除</span>
                </button>
            </div>
            <div>
                <table class="w-full">
                    <thead class="border-b-2 border-black hidden md:table-header-group">
                        <tr class="bg-gray-200">
                            <th class="py-4">
                                <label class="p-4 w-full">
                                    <input
                                        v-model="isAllSelected"
                                        :value="true"
                                        type="checkbox"
                                        @change="onClickAllCommentCheck"
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
                    <tbody>
                        <tr
                            v-for="(comment, index) in comments"
                            :key="index"
                            :class="index % 2 == 0 ? 'bg-gray-100' : ''"
                            class="flex flex-col md:table-row hover:bg-gray-200"
                            @click="onClickTr(comment.id)"
                        >
                            <td
                                class="bg-black text-center md:bg-transparent w-full md:w-auto"
                            >
                                <label class="w-full p-2 md:py-4 text-center block">
                                    <input
                                        v-model="checkedIds"
                                        name="article"
                                        :value="comment.id"
                                        type="checkbox"
                                    >
                                </label>
                            </td>
                            <td
                                :class="responsiveClass"
                                :data-label="headers.id"
                            >
                                <span class="px-2 py-4">
                                    {{ comment.id }}
                                </span>
                            </td>
                            <td
                                :class="responsiveClass"
                                :data-label="headers.status"
                            >
                                <span class="px-2 py-4">
                                    {{ convertStatus(comment.status) }}
                                </span>
                            </td>
                            <td
                                :class="responsiveClass"
                                :data-label="headers.userName"
                            >
                                <span class="px-2 py-4">
                                    {{ comment.user_name }}
                                </span>
                            </td>
                            <td
                                :class="responsiveClass"
                                :data-label="headers.idBlogContent"
                            >
                                <span class="px-2 py-4">
                                    {{ comment.id_blog_content }}
                                </span>
                            </td>
                            <td
                                :class="responsiveClass"
                                :data-label="headers.comment"
                            >
                                <span class="px-2 py-4">
                                    {{ comment.comment }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </main>
</template>
