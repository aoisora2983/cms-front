<script setup lang="ts">
import { getTagList } from '~/api/apis/blog/getTagList'
import type { Tag } from '~/api/models/blog/article'

interface Props {
    checkedTags: Tag[]
    show?: boolean
}

const tags: Tag[] = await getTagList()

const props = withDefaults(defineProps<Props>(), {
    show: false,
})

const initialTags = ref([...props.checkedTags])
const selectedTags = ref([...props.checkedTags])

const emits = defineEmits(['update:show', 'update:checkedTags'])

const updateShow = (data: boolean) => {
    emits('update:show', data)
}

const handleCheckbox = (ev: Event, tag: Tag) => {
    if (ev.target instanceof HTMLInputElement) {
        if (ev.target.checked) {
            selectedTags.value.push(tag)
        }
        else {
            selectedTags.value = selectedTags.value.filter(selectedTag => selectedTag.id != tag.id)
        }
    }
}

const isChecked = (id: number) => {
    for (const checkedTag of initialTags.value) {
        if (checkedTag.id == id) {
            return true
        }
    }
    return false
}

const onCancel = () => {
    selectedTags.value = [...initialTags.value]
    updateShow(false)
}

const onOk = () => {
    initialTags.value = [...selectedTags.value]
    emits('update:checkedTags', selectedTags.value)
    updateShow(false)
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
                タグ設定
            </h2>
            <ul>
                <li
                    v-for="(item, index) in tags"
                    :key="index"
                    class="flex items-center me-4 py-1"
                >
                    <input
                        :id="'tag-' + item.id"
                        :value="item"
                        :checked="isChecked(item.id)"
                        type="checkbox"
                        class="w-4 h-4 border-black rounded-sm"
                        @change="handleCheckbox($event, item)"
                    >
                    <label
                        :for="'tag-' + item.id"
                        class="ms-2 text-gray-900"
                    >
                        {{ item.label }}
                    </label>
                </li>
            </ul>
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
</template>
