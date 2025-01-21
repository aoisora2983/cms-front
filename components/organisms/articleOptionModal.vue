<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { fileupload } from '~/api/apis/common/fileupload'
import type { ArticleStatus } from '~/api/models/blog/article'
import { ARTICLE_STATUSES } from '~/constants/constants'
import noImageUrl from '@/assets/img/no_image.jpg'

interface Props {
    show?: boolean
    status?: ArticleStatus | null
    publishedStartTime?: Dayjs | null
    publishedEndTime?: Dayjs | null
    description?: string
    thumbnail?: string
}

const props = withDefaults(defineProps<Props>(), {
    show: false,
    status: null,
    publishedStartTime: null,
    publishedEndTime: null,
    description: '',
    thumbnail: '',
})

const loading = useLoading()
const description = ref(props.description)

const _publishedStartTime = ref(dayjs().startOf('day'))
if (props.publishedStartTime) {
    _publishedStartTime.value = dayjs(props.publishedStartTime)
}
let tmpPublishedEndTime = dayjs().startOf('day').add(1, 'month')
if (props.publishedEndTime != null) {
    tmpPublishedEndTime = dayjs(props.publishedEndTime).startOf('day')
}
const publishedEndAt = ref(tmpPublishedEndTime)
const publishedInfinity = ref(true)
const thumbnail = ref(props.thumbnail ? props.thumbnail : noImageUrl)

const status = ref(props.status ?? ARTICLE_STATUSES[0])
if (props.status != null) {
    const statusId = props.status != null ? props.status.id : 0
    status.value = ARTICLE_STATUSES.find(status => status.id == statusId) ?? ARTICLE_STATUSES[0]
}

const emits = defineEmits(
    [
        'update:show', 'update:status', 'update:description',
        'update:publishedStartTime', 'update:publishedEndTime', 'update:publishedInfinity',
        'update:thumbnail',
    ],
)

const updateShow = (data: boolean) => {
    emits('update:show', data)
}

const onOk = () => {
    emits('update:status', status.value)
    emits('update:description', description.value)
    emits('update:publishedStartTime', _publishedStartTime.value)
    emits('update:publishedEndTime', publishedEndAt.value)
    emits('update:publishedInfinity', publishedInfinity.value)
    emits('update:thumbnail', thumbnail.value)
    updateShow(false)
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
            thumbnail.value = res.url
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
    <section
        v-if="props.show"
        id="option"
        class="modal w-full h-full fixed top-0 left-0 flex justify-center overflow-y-auto"
    >
        <div
            class="overlay fixed top-0 left-0 bg-black opacity-70 w-screen h-screen"
            @click="onOk"
        />
        <div class="modal-body max-w-4xl w-full bg-white m-4 lg:m-auto p-8 rounded-sm h-fit">
            <h2 class="w-full text-2xl p-2 border-gray-500 border-b-2 mb-4">
                記事設定
            </h2>
            <div class="mb-4">
                <label
                    for="article-description"
                    class="block pb-1"
                >
                    記事の概要（SEO）
                </label>
                <textarea
                    id="article-description"
                    v-model="description"
                    class="py-2 px-4 w-full box-border border border-gray-300"
                    placeholder="記事の概要"
                />
            </div>
            <div class="mb-2 gap-2 grid grid-cols-1 md:grid-cols-2">
                <div class="mb-2">
                    <label class="block pb-1">
                        公開開始日
                    </label>
                    <MoleculeInputDateTime
                        v-model:datetime="_publishedStartTime"
                    />
                </div>
                <div class="mb-2">
                    <div class="flex gap-4 pb-1">
                        <label>
                            公開終了日
                        </label>
                        <div class="flex items-center gap-1">
                            <input
                                id="published-infinity"
                                v-model="publishedInfinity"
                                type="checkbox"
                                class="w-4 h-4 border-black rounded-sm"
                            >
                            <label
                                for="published-infinity"
                                class="ml-1"
                            >
                                無期限
                            </label>
                        </div>
                    </div>
                    <MoleculeInputDateTime
                        v-model:datetime="publishedEndAt"
                        :disabled="publishedInfinity"
                    />
                </div>
            </div>
            <div class="mb-4">
                <label
                    for="article-status"
                    class="block pb-1"
                >
                    記事の状態
                </label>
                <select
                    id="article-status"
                    v-model="status"
                    class="box-border border border-gray-300 w-full rounded-sm px-4 py-2"
                >
                    <option
                        v-for="(item, index) in ARTICLE_STATUSES"
                        :key="index"
                        :value="item"
                    >
                        {{ item.label }}
                    </option>
                </select>
            </div>
            <div class="mb-4">
                <label
                    htmlFor="thumbnail"
                    className="text-gray-700 pl-1 mb-2"
                >
                    サムネイルアップロード
                </label>
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex justify-center items-center border border-dashed border-gray-500 w-24 h-24 flex-none overflow-hidden">
                        <img
                            alt="Preview"
                            className="dark:invert w-23 h-23"
                            :src="thumbnail"
                        >
                    </div>
                    <div className="space-y-8 w-full grow">
                        <input
                            id="thumbnail"
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
            <div class="flex justify-end gap-2">
                <AtomButton
                    label="入力画面に戻る"
                    color="black"
                    border-color="black"
                    @click="onOk"
                />
            </div>
        </div>
    </section>
</template>
