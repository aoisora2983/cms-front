<script setup lang="ts">
import { fileupload } from '~/api/apis/common/fileupload'
import noImageUrl from '@/assets/img/no_image.jpg'
import { registerTag } from '~/api/apis/blog/registerTag'
import { ErrorMessages } from '~/api/fetch'

interface Props {
    show?: boolean
    id?: number
    name?: string
    image?: string
}

interface TagInput {
    id: number
    name: string
    image: string
}

const props = withDefaults(defineProps<Props>(), {
    show: false,
    id: 0,
    name: '',
    image: '',
})
const infoModal = useInfoModal()
const messageModal = useMessageModal()
const loading = useLoading()
const input = ref<TagInput>({
    id: 0,
    name: '',
    image: noImageUrl,
})
watch(
    () => props.name, () => {
        input.value.id = props.id
        input.value.name = props.name
        input.value.image = props.image != '' ? props.image : noImageUrl
    },
)

const emits = defineEmits(['update:show'])

const updateShow = (data: boolean) => {
    emits('update:show', data)
}

const onCancel = () => {
    updateShow(false)
}

const onOk = async () => {
    loading.load()
    try {
        await registerTag({
            id: input.value.id,
            name: input.value.name,
            filename: input.value.image,
        })
        updateShow(false)
        infoModal.open('登録に成功しました。', () => {
            navigateTo('/manage/blog/tag', {
                external: true,
            })
        })
    }
    catch (error) {
        if (error instanceof ErrorMessages) {
            messageModal.setMessages(error.messages)
        }
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
            input.value.image = res.url
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
        <div class="modal-body max-w-4xl w-full bg-white m-4 p-8 rounded-sm h-fit">
            <h2 class="w-full text-2xl p-2 border-gray-800 border-b-2 mb-4">
                タグ登録
            </h2>
            <div class="mb-4">
                <AtomInputText
                    id="tagname"
                    v-model:input="input.name"
                    label="タグ名"
                    placeholder="タグの名称を入力してください。"
                />
            </div>
            <div>
                <label
                    htmlFor="tag-image"
                    className="text-gray-700 font-bold pl-1 mb-2"
                >
                    タグアイコンアップロード
                </label>
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex justify-center items-center border border-dashed border-gray-500 w-24 h-24 flex-none overflow-hidden">
                        <img
                            alt="Preview"
                            className="dark:invert w-23 h-23"
                            :src="input.image"
                        >
                    </div>
                    <div className="space-y-8 w-full grow">
                        <input
                            id="tag-image"
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
                <div class="flex justify-end gap-2">
                    <AtomButton
                        label="OK"
                        color="white"
                        bg-color="blue-700"
                        @click="onOk()"
                    />
                    <AtomButton
                        label="Cancel"
                        border-color="black"
                        color="black"
                        bg-color="white"
                        @click="onCancel()"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
