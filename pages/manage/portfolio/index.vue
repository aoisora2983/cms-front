<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import noImageUrl from '@/assets/img/no_image.jpg'
import { getPortfolioList } from '~/api/apis/portfolio/getPortfolioList'
import { DATETIME_FORMAT, PORTFOLIO_STATUSES } from '~/constants/constants'
import { deletePortfolio } from '~/api/apis/portfolio/deleteComment'

definePageMeta({ layout: 'admin' })

const loading = useLoading()
const infoModal = useInfoModal()
const responsiveClass = 'flex text-center before:px-2 before:py-4  before:text-center before:font-bold before:w-2/5 before:content-[attr(data-label)] md:before:hidden md:table-cell'
const headers = {
    no: 'No',
    title: 'タイトル',
    status: '公開状態',
    datetime: '公開開始日',
    action: '',
}

const portfolioList = ref(await getPortfolioList())

const showModal = ref(false)
const portfolioId = ref(0)
const title = ref('')
const description = ref('')
const thumbnail = ref(noImageUrl)
const url = ref('')
const releaseTime = ref(dayjs())
const status = ref(0)

const onClickEdit = (
    _portfolioId: number,
    _title: string,
    _description: string,
    _thumbnail: string,
    _url: string,
    _releaseTime: Dayjs,
    _status: number,
) => {
    portfolioId.value = _portfolioId
    title.value = _title
    description.value = _description
    thumbnail.value = _thumbnail
    url.value = _url
    releaseTime.value = _releaseTime
    status.value = _status
    showModal.value = true
}

const onClickAdd = () => {
    portfolioId.value = 0
    title.value = ''
    description.value = ''
    thumbnail.value = noImageUrl
    url.value = ''
    releaseTime.value = dayjs()
    status.value = 0
    showModal.value = true
}

const onClickDelete = async (id: number, title: string) => {
    loading.load()
    try {
        await deletePortfolio({
            id: id,
        })
        portfolioList.value = await getPortfolioList()

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
    const status = PORTFOLIO_STATUSES.find(status => status.id == statusId)

    if (!status) {
        return ''
    }

    return status?.label
}

useHead({
    title: 'ポートフォリオ編集',
})
</script>

<template>
    <main class="max-w-7xl mx-auto w-full p-4">
        <div class="bg-white rounded p-4 my-4">
            検索枠
        </div>
        <section class="bg-white rounded p-4 my-4">
            <h1 class="mb-4 font-bold text-xl text-center">
                ポートフォリオ一覧
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
                        v-for="(portfolio, index) in portfolioList"
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
                                {{ portfolio.title }}
                            </span>
                        </td>
                        <td
                            :class="responsiveClass"
                            :data-label="headers.status"
                        >
                            <span class="px-2 py-4">
                                {{ getStatusLabel(portfolio.status) }}
                            </span>
                        </td>
                        <td
                            :class="responsiveClass"
                            :data-label="headers.datetime"
                        >
                            <span class="px-2 py-4">
                                {{ dayjs(portfolio.release_time).format(DATETIME_FORMAT) }}
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
                                        portfolio.id,
                                        portfolio.title,
                                        portfolio.description,
                                        portfolio.thumbnail,
                                        portfolio.detail_url,
                                        portfolio.release_time,
                                        portfolio.status,
                                    )"
                                />
                                <AtomButton
                                    label="削除"
                                    icon="delete"
                                    bg-color="red-600"
                                    @click="onClickDelete(
                                        portfolio.id,
                                        portfolio.title,
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
        <OrganismPortfolioRegisterModal
            v-model:show="showModal"
            v-model:portfolio-id="portfolioId"
            v-model:title="title"
            v-model:description="description"
            v-model:thumbnail="thumbnail"
            v-model:url="url"
            v-model:release-time="releaseTime"
            v-model:status="status"
        />
    </main>
</template>
