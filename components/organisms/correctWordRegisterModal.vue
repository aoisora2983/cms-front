<script setup lang="ts">
import { registerReplaceWord } from '~/api/apis/blog/registerReplaceWord'
import { ErrorMessages } from '~/api/fetch'
import { CHECK_LEVELS } from '~/constants/constants'

interface Props {
    show?: boolean
    id?: number
    idAccessibility: number
    wordFrom?: string
    wordTo?: string
    level?: number
    onOk: () => void
}
const props = withDefaults(defineProps<Props>(), {
    show: false,
    id: 0,
    idAccessibility: 0,
    wordFrom: '',
    wordTo: '',
    level: 0,
    onOk: () => {},
})

interface ReplaceWordInput {
    id: number
    wordFrom: string
    wordTo: string
    level: number
}

const input = ref<ReplaceWordInput>({
    id: 0,
    wordFrom: '',
    wordTo: '',
    level: 0,
})
watch(
    () => props.id, () => {
        input.value.id = props.id
        input.value.wordFrom = props.wordFrom
        input.value.wordTo = props.wordTo
        input.value.level = props.level
    },
)

const infoModal = useInfoModal()
const messageModal = useMessageModal()
const loading = useLoading()
const levels = CHECK_LEVELS

const emits = defineEmits(['update:show'])
const updateShow = (data: boolean) => {
    emits('update:show', data)
}

const onCancel = () => {
    updateShow(false)
}

const onClickOk = async () => {
    loading.load()
    try {
        await registerReplaceWord({
            id: input.value.id,
            id_accessibility: props.idAccessibility,
            word_from: input.value.wordFrom,
            word_to: input.value.wordTo,
            level: input.value.level,
        })
        updateShow(false)
        infoModal.open('登録に成功しました。', () => {
            props.onOk()
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
                置換文字編集
            </h2>
            <div class="mb-2">
                <div class="flex items-center">
                    <AtomInputText
                        id="portfolio-title"
                        v-model:input="input.wordFrom"
                        label="置換前"
                        placeholder="置き換える前の文字を入力"
                    />
                    <span class="px-2">
                        →
                    </span>
                    <AtomInputText
                        id="portfolio-title"
                        v-model:input="input.wordTo"
                        label="置換後"
                        placeholder="置き換える前の文字を入力"
                    />
                </div>
            </div>
            <div class="mb-2">
                <label
                    className="text-gray-700 font-bold pl-1 mb-2"
                >
                    警告レベル
                </label>
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <ul class="grid grid-cols-3 justify-items-center border border-gray-300 rounded">
                        <li
                            v-for="(levelItem, levelIndex) in levels"
                            :key="levelIndex"
                            class=" w-full text-center [&:not(:last-child)]:border-r border-gray-300"
                        >
                            <input
                                :id="'level-' + levelIndex"
                                v-model="input.level"
                                :name="'level'"
                                :value="levelItem.id"
                                class="hidden peer"
                                type="radio"
                            >
                            <label
                                :for="'level-' + levelIndex"
                                class="flex items-center justify-center p-2 w-full h-full peer-checked:bg-green-300"
                            >
                                {{ levelItem.label }}
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="flex justify-end gap-2">
                <AtomButton
                    label="OK"
                    color="white"
                    bg-color="blue-700"
                    @click="onClickOk"
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
