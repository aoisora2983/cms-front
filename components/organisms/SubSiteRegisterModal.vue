<script setup lang="ts">
import { registerSubSite } from '~/api/apis/subSite/registerSubSite'
import { ErrorMessages } from '~/api/fetch'
import { SUB_SITE_STATUSES } from '~/constants/constants'

interface Props {
    show?: boolean
    subSiteId?: number
    subDirName?: string
    iconText: string
    title?: string
    description?: string
    status?: number
}
const props = withDefaults(defineProps<Props>(), {
    show: false,
    subSiteId: 0,
    subDirName: '',
    icon_text: '',
    title: '',
    description: '',
    status: 0,
})

interface SubSiteInput {
    subSiteId: number
    subDirName: string
    iconText: string
    title: string
    description: string
    status: number
}

const input = ref<SubSiteInput>({
    subSiteId: 0,
    subDirName: '',
    iconText: '',
    title: '',
    description: '',
    status: 0,
})
watch(
    () => props.subSiteId, () => {
        input.value.subSiteId = props.subSiteId
        input.value.subDirName = props.subDirName
        input.value.iconText = props.iconText
        input.value.title = props.title
        input.value.description = props.description
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
        await registerSubSite({
            id: input.value.subSiteId,
            sub_dir_name: input.value.subDirName,
            icon_text: input.value.iconText,
            title: input.value.title,
            description: input.value.description,
            status: input.value.status,
            sort_order: input.value.subSiteId,
        })
        updateShow(false)
        infoModal.open('登録に成功しました。', () => {
            navigateTo('/manage/blog/subSite', {
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
                サブサイト編集
            </h2>
            <div class="mb-2">
                <AtomInputText
                    id="sub-site-title"
                    v-model:input="input.title"
                    label="タイトル"
                    placeholder="サブサイトのタイトルを入力"
                />
            </div>
            <div class="mb-2">
                <label
                    class="text-gray-700 font-bold pl-1 mb-2"
                    for="sub-site-description"
                >
                    概要
                </label>
                <textarea
                    id="sub-site-description"
                    v-model="input.description"
                    class="py-2 px-4 w-full box-border border border-gray-300 rounded-sm"
                />
            </div>
            <div class="mb-2">
                <AtomInputText
                    id="sub-site-dir"
                    v-model:input="input.subDirName"
                    label="サブディレクトリ名"
                    placeholder="サブサイト用のサブディレクトリを入力"
                />
            </div>
            <div class="mb-2">
                <AtomInputText
                    id="sub-site-icon"
                    v-model:input="input.iconText"
                    label="アイコンテキスト"
                    placeholder="アイコンの文字列を入力（※Google Font Icons使用）"
                />
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
                        v-for="(item, index) in SUB_SITE_STATUSES"
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
