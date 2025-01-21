<script setup lang="ts">
import dayjs from 'dayjs'
import { getOpinionList } from '~/api/apis/opinion/getOpinionList'
import type { Opinion } from '~/api/models/opinion/opinion'
import { DATETIME_FORMAT } from '~/constants/constants'

definePageMeta({ layout: 'admin' })

const responsiveClass = 'flex text-center before:px-2 before:py-4  before:text-center before:font-bold before:w-2/5 before:content-[attr(data-label)] md:before:hidden md:table-cell'
const headers = {
    id: 'ID',
    name: 'Name',
    content: '問合せ内容',
    mail: 'メールアドレス',
    ip: 'IP',
    datetime: '問合せ日時',
}
const opinions: Opinion[] = await getOpinionList({
    name: '',
})

const isAllSelected = ref(false)
const checkedIds = ref([] as number[])

const getIds = () => {
    const ids = []

    for (const index in opinions) {
        ids.push(opinions[index].id)
    }

    return ids
}

const onClickAllOpinionCheck = () => {
    if (isAllSelected.value) {
        checkedIds.value = getIds()
    }
    else {
        checkedIds.value = []
    }
}

useHead({
    title: '問合せ管理',
})
</script>

<template>
    <main class="max-w-7xl mx-auto w-full p-4">
        <div class="bg-white rounded p-4 my-4">
            検索枠
        </div>
        <section class="bg-white rounded p-4 my-4">
            <h1 class="mb-4 font-bold text-xl text-center">
                問合せ一覧
            </h1>
            <table class="w-full">
                <thead class="border-b-2 border-black hidden md:table-header-group">
                    <tr class="bg-gray-200">
                        <th class="py-4">
                            <label class="p-4 w-full">
                                <input
                                    v-model="isAllSelected"
                                    :value="true"
                                    type="checkbox"
                                    @change="onClickAllOpinionCheck"
                                >
                            </label>
                        </th>
                        <th
                            v-for="(header, id) in headers"
                            :key="id"
                            class="py-4"
                        >
                            {{ header }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(opinion, index) in opinions"
                        :key="index"
                        :class="index % 2 == 0 ? 'bg-gray-100' : ''"
                        class="flex flex-col md:table-row hover:bg-gray-200"
                    >
                        <td
                            class="bg-black text-center md:bg-transparent w-full md:w-auto"
                        >
                            <label class="w-full p-2 md:py-4 text-center block">
                                <input
                                    v-model="checkedIds"
                                    name="article"
                                    :value="opinion.id"
                                    type="checkbox"
                                >
                            </label>
                        </td>
                        <td
                            :class="responsiveClass"
                            :data-label="headers.id"
                        >
                            <span class="px-2 py-4">
                                {{ opinion.id }}
                            </span>
                        </td>
                        <td
                            :class="responsiveClass"
                            :data-label="headers.name"
                        >
                            <span class="px-2 py-4">
                                {{ opinion.name }}
                            </span>
                        </td>
                        <td
                            :class="responsiveClass"
                            :data-label="headers.content"
                            class="whitespace-pre-wrap"
                        >
                            <span class="px-2 py-4">
                                {{ opinion.content }}
                            </span>
                        </td>
                        <td
                            :class="responsiveClass"
                            :data-label="headers.mail"
                        >
                            <span class="px-2 py-4">
                                {{ opinion.email }}
                            </span>
                        </td>
                        <td
                            :class="responsiveClass"
                            :data-label="headers.ip"
                        >
                            <span class="px-2 py-4">
                                {{ opinion.ip }}
                            </span>
                        </td>
                        <td
                            :class="responsiveClass"
                            :data-label="headers.datetime"
                        >
                            <span class="px-2 py-4">
                                {{ dayjs(opinion.send_time).format(DATETIME_FORMAT) }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
    </main>
</template>
