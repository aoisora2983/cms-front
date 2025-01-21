<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import noImageUrl from '@/assets/img/no_image.jpg'
import { fileupload } from '~/api/apis/common/fileupload'
import { registerPortfolio } from '~/api/apis/portfolio/registerPortfolio'
import { ErrorMessages } from '~/api/fetch'
import { PORTFOLIO_STATUSES } from '~/constants/constants'

interface Props {
    show?: boolean
    portfolioId?: number
    title?: string
    description?: string
    thumbnail?: string
    url?: string
    releaseTime?: Dayjs | null
    status?: number
}
const props = withDefaults(defineProps<Props>(), {
    show: false,
    portfolioId: 0,
    title: '',
    description: '',
    thumbnail: '',
    url: '',
    releaseTime: null,
    status: 0,
})

interface PortfolioInput {
    portfolioId: number
    title: string
    description: string
    thumbnail: string
    url: string
    releaseTime: Dayjs
    status: number
}

const input = ref<PortfolioInput>({
    portfolioId: 0,
    title: '',
    description: '',
    thumbnail: noImageUrl,
    url: '',
    releaseTime: dayjs(),
    status: 0,
})
watch(
    () => props.portfolioId, () => {
        input.value.portfolioId = props.portfolioId
        input.value.title = props.title
        input.value.description = props.description
        input.value.thumbnail = props.thumbnail != '' ? props.thumbnail : noImageUrl
        input.value.url = props.url
        input.value.releaseTime = dayjs(props.releaseTime)
        input.value.status = props.status
    },
)

const infoModal = useInfoModal()
const messageModal = useMessageModal()
const loading = useLoading()
const emits = defineEmits(['update:show'])

const updateShow = (data: boolean) => {
    emits('update:show', data)
}

const onChangeStatus = (event: Event) => {
    if (!event) {
        return
    }

    if (!event.target) {
        return
    }
    const target = event.target as HTMLInputElement
    input.value.status = parseInt(target.value)
}

const isSelected = (id: number) => {
    if (input.value.status == id) {
        return true
    }
    return false
}

const onCancel = () => {
    updateShow(false)
}

const onOk = async () => {
    loading.load()
    try {
        await registerPortfolio({
            id: input.value.portfolioId,
            title: input.value.title,
            description: input.value.description,
            thumbnail: input.value.thumbnail,
            detail_url: input.value.url,
            release_time: input.value.releaseTime != null ? input.value.releaseTime : dayjs(),
            status: input.value.status,
            sort_order: input.value.portfolioId,
        })
        updateShow(false)
        infoModal.open('登録に成功しました。', () => {
            navigateTo('/manage/portfolio', {
                external: true,
            })
        })
    }
    catch (error) {
        if (error instanceof ErrorMessages) {
            messageModal.setMessages(error.messages)
        }
    }
    finally {
        loading.unload()
    }

    loading.unload()
}

const onChangeImage = async (event: Event) => {
    if (!event) {
        return
    }

    if (!event.target) {
        return
    }
    const target = event.target as HTMLInputElement
    const files = target.files

    if (files) {
        const formData = new FormData()
        formData.append('file', files[0])

        try {
            loading.load()
            const res = await fileupload(formData)
            input.value.thumbnail = res.url
        }
        catch (error) {
            console.log(error)
        }
        finally {
            loading.unload()
        }
    }
}
</script>

<template>
    <div
        v-if="props.show"
        class="modal w-full h-full fixed top-0 left-0 flex justify-center overflow-y-auto"
    >
        <div
            class="overlay fixed top-0 left-0 bg-black opacity-70 w-screen h-screen"
            @click="onCancel()"
        />
        <div class="modal-body max-w-4xl w-full z-20 bg-white m-4 p-8 rounded-sm h-fit">
            <h2 class="w-full text-2xl p-2 border-gray-800 border-b-2 mb-4">
                ポートフォリオ編集
            </h2>
            <div class="mb-2">
                <AtomInputText
                    id="portfolio-title"
                    v-model:input="input.title"
                    label="タイトル"
                    placeholder="作品のタイトルを入力"
                />
            </div>
            <div class="mb-2">
                <label
                    class="text-gray-700 font-bold pl-1 mb-2"
                    for="portfolio-description"
                >
                    概要
                </label>
                <textarea
                    id="portfolio-description"
                    v-model="input.description"
                    class="py-2 px-4 w-full box-border border border-gray-300 rounded-sm"
                />
            </div>
            <div class="mb-2">
                <label
                    htmlFor="tag-image"
                    className="text-gray-700 font-bold pl-1 mb-2"
                >
                    製品画像アップロード
                </label>
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div
                        className="flex justify-center items-center border border-dashed border-gray-500 w-24 h-24 flex-none overflow-hidden"
                    >
                        <img
                            alt="Preview"
                            className="dark:invert w-23 h-23"
                            :src="input.thumbnail"
                        >
                    </div>
                    <div className="space-y-8 w-full grow">
                        <input
                            id="portfolio-image"
                            type="file"
                            className="w-full text-gray-500 font-medium text-base bg-gray-100 file:cursor-pointer cursor-pointer file:border-0 file:py-2.5 file:px-4 file:mr-4 file:bg-gray-800 file:hover:bg-gray-700 file:text-white rounded-sm"
                            @change="onChangeImage"
                        >
                        <input
                            id="filename"
                            type="hidden"
                        >
                    </div>
                </div>
            </div>
            <div class="mb-2">
                <AtomInputText
                    id="portfolio-url"
                    v-model:input="input.url"
                    label="URL"
                    placeholder="ポートフォリオサイトURLを入力"
                />
            </div>
            <div class="mb-2">
                <label className="text-gray-700 font-bold pl-1 mb-2">
                    リリース日時
                </label>
                <MoleculeInputDateTime v-model:datetime="input.releaseTime" />
            </div>
            <div class="mb-4">
                <label
                    for="portfolio-status"
                    className="text-gray-700 font-bold pl-1 mb-2"
                >
                    状態
                </label>
                <select
                    class="box-border border border-gray-300 w-full rounded-sm px-4 py-2"
                    @change="onChangeStatus($event)"
                >
                    <option
                        v-for="(item, index) in PORTFOLIO_STATUSES"
                        :key="index"
                        :value="item.id"
                        :selected="isSelected(item.id)"
                    >
                        {{ item.label }}
                    </option>
                </select>
            </div>
            <div class="flex justify-end gap-2">
                <AtomButton
                    label="OK"
                    color="white"
                    bg-color="blue-700"
                    @click="onOk"
                />
                <AtomButton
                    label="Cancel"
                    border-color="black"
                    color="black"
                    bg-color="white"
                    @click="onCancel"
                />
            </div>
        </div>
    </div>
</template>
