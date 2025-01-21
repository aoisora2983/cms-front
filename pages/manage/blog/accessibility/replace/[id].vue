<script setup lang="ts">
import { getReplaceWordList } from '~/api/apis/blog/getReplaceWordList'
import type { ReplaceWord } from '~/api/models/blog/accessibility'
import { CHECK_LEVELS } from '~/constants/constants'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const accessibilityId = parseInt(route.params.id as string)

// const loading = useLoading()
// const infoModal = useInfoModal()

const wordList = ref([] as ReplaceWord[])

const getReplaceWord = async () => {
    wordList.value = await getReplaceWordList({ id: accessibilityId })
}
await getReplaceWord()

const levels = CHECK_LEVELS

const responsiveClass = 'flex text-center before:px-2 before:py-4  before:text-center before:font-bold before:w-2/5 before:content-[attr(data-label)] md:before:hidden md:table-cell'
const headers = {
    id: 'ID',
    from: '変換元',
    to: '変換先',
    level: '警告レベル',
    action: '',
}

const isAllSelected = ref(false)
const checkedIds = ref([] as number[])
const show = ref(false)
const modalValue = ref({
    id: 0,
    wordFrom: '',
    wordTo: '',
    level: 0,
})

const getIds = () => {
    const ids = []

    for (const index in wordList.value) {
        ids.push(wordList.value[index].id)
    }

    return ids
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

const onClickAdd = () => {
    show.value = true
    modalValue.value.id = 0
    modalValue.value.wordFrom = ''
    modalValue.value.wordTo = ''
    modalValue.value.level = 0
}

const onClickEdit = (id: number, wordFrom: string, wordTo: string, level: number) => {
    show.value = true
    modalValue.value.id = id
    modalValue.value.wordFrom = wordFrom
    modalValue.value.wordTo = wordTo
    modalValue.value.level = level
}

const onClickRemove = () => {

}

useHead({
    title: 'アクセシビリティ管理',
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
                    name="add"
                    class="bg-blue-700 text-white hover:opacity-80 focus:ring-4 focus:ring-gray-300 rounded px-5 py-2.5 me-2 mb-2 flex items-center justify-center"
                    @click="onClickAdd"
                >
                    <i class="material-icons mr-2 text-2xl">add</i>
                    <span>新規</span>
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
                            v-for="(word, index) in wordList"
                            :key="index"
                            :class="index % 2 == 0 ? 'bg-gray-100' : ''"
                            class="flex flex-col md:table-row hover:bg-gray-200"
                            @click="onClickTr(word.id)"
                        >
                            <td
                                class="bg-black text-center md:bg-transparent w-full md:w-auto"
                            >
                                <label class="w-full p-2 md:py-4 text-center block">
                                    <input
                                        v-model="checkedIds"
                                        name="article"
                                        :value="word.id"
                                        type="checkbox"
                                    >
                                </label>
                            </td>
                            <td
                                :class="responsiveClass"
                                :data-label="headers.id"
                            >
                                <span class="px-2 py-4">
                                    {{ word.id }}
                                </span>
                            </td>
                            <td
                                :class="responsiveClass"
                                :data-label="headers.from"
                            >
                                <span class="px-2 py-4">
                                    {{ word.word_from }}
                                </span>
                            </td>
                            <td
                                :class="responsiveClass"
                                :data-label="headers.to"
                            >
                                <span class="px-2 py-4">
                                    {{ word.word_to }}
                                </span>
                            </td>
                            <td
                                :class="responsiveClass"
                                :data-label="headers.level"
                            >
                                <span class="px-2 py-4">
                                    {{ levels.find((_level) => _level.id == word.level)?.label }}
                                </span>
                            </td>
                            <td>
                                <div class="flex items-center justify-center">
                                    <button
                                        name="add"
                                        class="bg-blue-700 text-white hover:opacity-80 focus:ring-4 focus:ring-gray-300 rounded px-5 py-2.5 me-2 mb-2 flex items-center justify-center"
                                        @click="onClickEdit(word.id, word.word_from, word.word_to, word.level)"
                                    >
                                        <i class="material-icons mr-2 text-2xl">edit</i>
                                        <span>修正</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
        <OrganismCorrectWordRegisterModal
            :id="modalValue.id"
            v-model:show="show"
            :id-accessibility="accessibilityId"
            :word-from="modalValue.wordFrom"
            :word-to="modalValue.wordTo"
            :level="modalValue.level"
            :on-ok="getReplaceWord"
        />
    </main>
</template>
