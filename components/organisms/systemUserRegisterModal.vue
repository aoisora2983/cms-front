<script setup lang="ts">
import { fileupload } from '~/api/apis/common/fileupload'
import { ErrorMessages } from '~/api/fetch'
import { registerUser } from '~/api/apis/users/registerUser'
import type { UserLink } from '~/api/models/user/user'
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
    links?: UserLink[]
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
    links: () => [],
})

interface UserLinkInput {
    iconPath: string
    url: string
    alt: string
}

interface UserInput {
    id: number
    groupId: number
    name: string
    description: string
    mail: string
    iconPath: string
    password: string
    links: UserLinkInput[]
}

const createLinkInput = (link?: UserLink): UserLinkInput => ({
    iconPath: link && link.icon_path !== '' ? link.icon_path : noImageUrl,
    url: link?.url ?? '',
    alt: link?.alt ?? '',
})

const input = ref<UserInput>({
    id: 0,
    groupId: 0,
    name: '',
    description: '',
    mail: '',
    iconPath: noImageUrl,
    password: '',
    links: [createLinkInput()],
})

const syncInput = () => {
    const links = (props.links ?? []).map(link => createLinkInput(link))
    input.value.id = props.id
    input.value.groupId = props.groupId
    input.value.name = props.name
    input.value.description = props.description
    input.value.mail = props.mail
    input.value.iconPath = props.iconPath != '' ? props.iconPath : noImageUrl
    input.value.password = props.password
    input.value.links = links.length > 0 ? links : [createLinkInput()]
}

watch(
    () => props.show,
    (show) => {
        if (show) {
            syncInput()
        }
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
            links: input.value.links
                .filter(link => link.url.trim() !== '')
                .map(link => ({
                    icon_path: link.iconPath === noImageUrl ? '' : link.iconPath,
                    url: link.url.trim(),
                    alt: link.alt.trim(),
                })),
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

const onChangeImage = async (event: Event, index?: number) => {
    if (!event) {
        return
    }

    if (!event.target) {
        return
    }
    const target = event.target as HTMLInputElement
    const files = target.files

    if (files && files[0]) {
        const formData = new FormData()
        formData.append('file', files[0])

        try {
            loading.load()
            const res = await fileupload(formData)
            if (typeof index === 'number') {
                const link = input.value.links[index]
                if (link) {
                    link.iconPath = res.url
                }
            }
            else {
                input.value.iconPath = res.url
            }
        }
        catch (error) {
            console.log(error)
        }
        finally {
            loading.unload()
        }
    }
}

const onAddLink = () => {
    input.value.links.push(createLinkInput())
}

const onRemoveLink = (index: number) => {
    input.value.links.splice(index, 1)
    if (input.value.links.length === 0) {
        input.value.links.push(createLinkInput())
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
            <div class="mb-2">
                <h3 class="font-bold pl-1 mt-6 mb-2">
                    関連リンク
                </h3>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="border-b bg-gray-100">
                            <tr class="text-left">
                                <th class="py-2 pl-2 w-12">
                                    No.
                                </th>
                                <th class="py-2 pl-2">
                                    アイコン
                                </th>
                                <th class="py-2 pl-2">
                                    リンク
                                </th>
                                <th class="py-2 pl-2">
                                    アイコンの説明
                                </th>
                                <th class="pl-2" />
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(link, index) in input.links"
                                :key="index"
                                :class="index % 2 == 0 ? '' : 'bg-gray-100'"
                            >
                                <td class="py-2 pl-2 align-middle">
                                    {{ index + 1 }}.
                                </td>
                                <td class="py-2 pl-2 align-middle">
                                    <div class="flex items-center gap-2">
                                        <label>
                                            <img
                                                :alt="link.alt !== '' ? link.alt : 'リンクアイコンのプレビュー'"
                                                class="w-10 h-10 object-contain border border-dashed border-gray-500"
                                                :src="link.iconPath"
                                            >
                                            <input
                                                :id="'user-link-icon-' + index"
                                                type="file"
                                                accept="image/*"
                                                class="hidden"
                                                @change="onChangeImage($event, index)"
                                            >
                                        </label>
                                    </div>
                                </td>
                                <td class="py-2 pl-2 align-middle">
                                    <input
                                        :id="'user-link-url-' + index"
                                        v-model="link.url"
                                        type="url"
                                        placeholder="GitHubリンク、SNSリンクなど"
                                        class="border border-gray-300 rounded-sm py-2 px-3 text-gray-700"
                                    >
                                </td>
                                <td class="py-2 pl-2 align-middle">
                                    <input
                                        :id="'user-link-alt-' + index"
                                        v-model="link.alt"
                                        type="text"
                                        placeholder="アイコン画像の説明文"
                                        class="border border-gray-300 rounded-sm py-2 px-3 text-gray-700"
                                    >
                                </td>
                                <td class="py-2 align-middle">
                                    <button
                                        v-if="index > 0"
                                        name="remove"
                                        class="bg-red-600 text-white hover:opacity-80 focus:ring-4 focus:ring-gray-300 rounded px-5 py-2.5 me-2 mb-2 flex items-center justify-center"
                                        @click="onRemoveLink(index)"
                                    >
                                        <i class="material-icons mr-2 text-2xl">delete</i>
                                        <span>削除</span>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <AtomButton
                    label="リンクを追加"
                    icon="add"
                    bg-color="blue-700"
                    class="mt-2"
                    @click="onAddLink"
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
