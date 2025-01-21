<script setup lang="ts">
import { fileupload } from '~/api/apis/common/fileupload'
import { ErrorMessages } from '~/api/fetch'
import { registerUser } from '~/api/apis/users/registerUser'
import noImageUrl from '@/assets/img/no_image.jpg'

interface Props {
    show?: boolean
    id: number
    groupId: number
    name: string
    description: string
    mail: string
    iconPath: string
    password: string
}
const props = withDefaults(defineProps<Props>(), {
    show: false,
    id: 0,
    groupId: 0,
    name: '',
    description: '',
    mail: '',
    iconPath: noImageUrl,
    password: '',
})

interface PortfolioInput {
    id: number
    groupId: number
    name: string
    description: string
    mail: string
    iconPath: string
    password: string
}

const input = ref<PortfolioInput>({
    id: 0,
    groupId: 0,
    name: '',
    description: '',
    mail: '',
    iconPath: noImageUrl,
    password: '',
})
watch(
    () => props.id, () => {
        input.value.id = props.id
        input.value.groupId = props.groupId
        input.value.name = props.name
        input.value.description = props.description
        input.value.mail = props.mail
        input.value.iconPath = props.iconPath != '' ? props.iconPath : noImageUrl
        input.value.password = props.password
    },
)

const infoModal = useInfoModal()
const messageModal = useMessageModal()
const loading = useLoading()
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
        await registerUser({
            id: input.value.id,
            group_id: input.value.groupId,
            name: input.value.name,
            password: input.value.password,
            mail: input.value.mail,
            description: input.value.description,
            filename: input.value.iconPath,
        })
        updateShow(false)
        infoModal.open('登録に成功しました。', () => {
            navigateTo('/manage/user', {
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
            input.value.iconPath = res.url
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
                ユーザー編集
            </h2>
            <div class="mb-2">
                <AtomInputText
                    id="user-name"
                    v-model:input="input.name"
                    label="ユーザー名"
                    placeholder="ユーザー名を入力"
                />
            </div>
            <div class="mb-2">
                <label
                    class="text-gray-700 font-bold pl-1 mb-2"
                    for="user-description"
                >
                    概要
                </label>
                <textarea
                    id="user-description"
                    v-model="input.description"
                    class="py-2 px-4 w-full box-border border border-gray-300 rounded-sm"
                />
            </div>
            <div class="mb-2">
                <label
                    htmlFor="user-image"
                    className="text-gray-700 font-bold pl-1 mb-2"
                >
                    アイコン画像アップロード
                </label>
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div
                        className="flex justify-center items-center border border-dashed border-gray-500 w-24 h-24 flex-none overflow-hidden"
                    >
                        <img
                            alt="Preview"
                            className="dark:invert w-23 h-23"
                            :src="input.iconPath"
                        >
                    </div>
                    <div className="space-y-8 w-full grow">
                        <input
                            id="user-image"
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
                    id="user-email"
                    v-model:input="input.mail"
                    label="メールアドレス"
                    placeholder="ユーザーのメールアドレスを入力"
                />
            </div>
            <div class="mb-2">
                <AtomInputText
                    id="user-password"
                    v-model:input="input.password"
                    label="パスワード"
                    placeholder="ユーザーのパスワードを入力"
                />
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
