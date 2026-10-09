<script setup lang="ts">
import { SUB_SITE_STATUSES } from '~/constants/constants'
import { getSubSiteList } from '~/api/apis/subSite/getSubSiteList'
import { deleteSubSite } from '~/api/apis/subSite/deleteSubSite'

definePageMeta({ layout: 'admin' })

const loading = useLoading()
const infoModal = useInfoModal()
const responsiveClass = 'flex text-center before:px-2 before:py-4  before:text-center before:font-bold before:w-2/5 before:content-[attr(data-label)] md:before:hidden md:table-cell'
const headers = {
    no: 'No',
    title: 'タイトル',
    status: '公開状態',
    action: '',
}

const subSiteList = ref(await getSubSiteList())

const showModal = ref(false)
const subSiteId = ref(0)
const subDirName = ref('')
const iconText = ref('')
const title = ref('')
const description = ref('')
const status = ref(0)

const onClickEdit = (
    _subSiteId: number,
    _subDirName: string,
    _title: string,
    _description: string,
    _status: number,
) => {
    subSiteId.value = _subSiteId
    subDirName.value = _subDirName
    title.value = _title
    description.value = _description
    status.value = _status
    showModal.value = true
}

const onClickAdd = () => {
    subSiteId.value = 0
    subDirName.value = ''
    title.value = ''
    description.value = ''
    status.value = 0
    showModal.value = true
}

const onClickDelete = async (id: number, title: string) => {
    loading.load()
    try {
        await deleteSubSite({
            id: id,
        })
        subSiteList.value = await getSubSiteList()

        infoModal.open(title + 'を削除しました。', () => {})
    }
    catch (error) {
        console.log(error)
    }
    finally {
        loading.unload()
    }
}

const getStatusLabel = (statusId: number) => {
    const status = SUB_SITE_STATUSES.find(status => status.id == statusId)

    if (!status) {
        return ''
    }

    return status?.label
}

useHead({
    title: 'サブサイト編集',
})
</script>

<template>
    <main class="max-w-7xl mx-auto w-full p-4">
        <OrganismBlogEditHeader />
        <div class="bg-white rounded p-4 my-4 border border-gray-400">
            検索枠
        </div>
        <section class="bg-white rounded p-4 my-4 border border-gray-400">
            <h1 class="mb-4 font-bold text-xl text-center">
                サブサイト一覧
            </h1>
            <table class="w-full">
                <thead class="border-b-2 border-black hidden md:table-header-group">
                    <tr class="bg-gray-200">
                        <th class="py-4" />
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
                        v-for="(subSite, index) in subSiteList"
                        :key="index"
                        :class="index % 2 == 0 ? 'bg-gray-100' : ''"
                        class="flex flex-col md:table-row hover:bg-gray-200"
                    >
                        <td
                            class="bg-black text-center md:bg-transparent w-full md:w-auto"
                        >
                            <label class="w-full p-2 md:py-4 text-center block" />
                        </td>
                        <td
                            :class="responsiveClass"
                            :data-label="headers.no"
                        >
                            <span class="px-2 py-4">
                                {{ index + 1 }}
                            </span>
                        </td>
                        <td
                            :class="responsiveClass"
                            :data-label="headers.title"
                        >
                            <span class="px-2 py-4">
                                {{ subSite.title }}
                            </span>
                        </td>
                        <td
                            :class="responsiveClass"
                            :data-label="headers.status"
                        >
                            <span class="px-2 py-4">
                                {{ getStatusLabel(subSite.status) }}
                            </span>
                        </td>
                        <td
                            :class="responsiveClass"
                            :data-label="headers.action"
                            class="py-4"
                        >
                            <div class="w-full flex justify-evenly md:flex">
                                <AtomButton
                                    label="修正"
                                    icon="edit"
                                    bg-color="blue-700"
                                    @click="onClickEdit(
                                        subSite.id,
                                        subSite.subdir_name,
                                        subSite.title,
                                        subSite.description,
                                        subSite.status,
                                    )"
                                />
                                <AtomButton
                                    label="削除"
                                    icon="delete"
                                    bg-color="red-600"
                                    @click="onClickDelete(
                                        subSite.id,
                                        subSite.title,
                                    )"
                                />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="w-full mt-4">
                <AtomButton
                    label="新規追加"
                    icon="add"
                    bg-color="blue-700"
                    class="w-full"
                    @click="onClickAdd"
                />
            </div>
        </section>
        <OrganismSubSiteRegisterModal
            v-model:show="showModal"
            v-model:sub-site-id="subSiteId"
            v-model:sub-dir-name="subDirName"
            v-model:icon-text="iconText"
            v-model:title="title"
            v-model:description="description"
            v-model:status="status"
        />
    </main>
</template>
