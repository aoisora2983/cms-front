<script setup lang="ts">
import { deleteTag } from '~/api/apis/blog/deleteTag'
import { getTagList } from '~/api/apis/blog/getTagList'
import type { Tag } from '~/api/models/blog/article'

definePageMeta({ layout: 'admin' })

const STATUS_GHOST = 1

const loading = useLoading()
const infoModal = useInfoModal()
const masterTags = ref<Tag[]>(await getTagList())
const tags = ref<Tag[]>(JSON.parse(JSON.stringify(masterTags.value)))
const showTagModal = ref<boolean>(false)

const dragFromIndex = ref<number | null>(null)
const dragToIndex = ref<number | null>(null)

const onDragStart = (index: number) => {
    dragFromIndex.value = index
}

const onDragEnter = (index: number) => {
    dragToIndex.value = index
    const array = tags.value
    let to = null
    if (dragFromIndex.value != index && dragFromIndex.value != null) {
        to = JSON.parse(JSON.stringify(array[dragFromIndex.value]))
        to.status = STATUS_GHOST

        if (dragFromIndex.value > index) {
            array.splice(dragToIndex.value, 0, to)
            array.splice(dragFromIndex.value + 1, 1)
        }
        else {
            array.splice(dragToIndex.value + 1, 0, to)
            array.splice(dragFromIndex.value, 1)
        }
    }
}

const onDragLeave = () => {
    tags.value = JSON.parse(JSON.stringify(masterTags.value))
}
const onDrop = () => {
    const array = masterTags.value

    if (
        dragFromIndex.value != dragToIndex.value
        && dragFromIndex.value != null
        && dragToIndex.value != null
    ) {
        if (dragFromIndex.value > dragToIndex.value) { // 移動元が移動先より上なら、
            // toの位置に追加し、fromの位置を削除
            array.splice(dragToIndex.value, 0, array[dragFromIndex.value])
            array.splice(dragFromIndex.value + 1, 1)
        }
        if (dragFromIndex.value < dragToIndex.value) { // 移動元が移動先より下なら、
            // toの位置に追加し、fromの位置を削除
            array.splice(dragToIndex.value + 1, 0, array[dragFromIndex.value])
            array.splice(dragFromIndex.value, 1)
        }

        // 直した配列を表示に反映
        tags.value = JSON.parse(JSON.stringify(masterTags.value))
    }

    onDragEnd()
}

const onDragEnd = () => {
    if (dragFromIndex.value !== null) {
        tags.value[dragFromIndex.value].status = undefined
    }
    if (dragToIndex.value !== null) {
        tags.value[dragToIndex.value].status = undefined
    }
    dragFromIndex.value = null
    dragToIndex.value = null
}

const addClass = (status: number | undefined) => {
    if (typeof status != 'undefined' && status == STATUS_GHOST) {
        return 'opacity-70'
    }
}

const touchOverIndex = ref<number | null>(null)
// 指の位置にあるindexを取得してdragenterと同じ操作を行う
const onTouchmove = (event: TouchEvent) => {
    const x = event.changedTouches[0].clientX
    const y = event.changedTouches[0].clientY
    let dom = document.elementFromPoint(x, y)

    if (!dom) {
        return
    }

    // 隙間に入ると親要素を掴んでしまうので親要素の場合無視する
    if (dom.tagName == 'UL') {
        return
    }

    const li = dom.closest('li')
    if (li) {
        dom = li
    }
    const ulChildren = dom.closest('ul')?.children
    if (!ulChildren) {
        return
    }

    const lists = Array.from(ulChildren)
    const index = lists.findIndex(li => li == dom)

    if (touchOverIndex.value === index) { // 同じなら処理しない
        return
    }
    else {
        onDragLeave()
        onDragEnter(index)
        touchOverIndex.value = index
    }
}

const tagId = ref(0)
const tagName = ref('')
const iconPath = ref('')
const onClickEdit = (id: number, name: string, image: string) => {
    tagId.value = id
    tagName.value = name
    iconPath.value = image
    showTagModal.value = true
}

const onClickDelete = async (id: number, name: string) => {
    loading.load()
    try {
        await deleteTag({
            id: id,
        })

        masterTags.value = await getTagList()
        tags.value = JSON.parse(JSON.stringify(masterTags.value))

        infoModal.open(name + 'を削除しました。', () => {})
    }
    catch (error) {
        console.log(error)
    }
    finally {
        loading.unload()
    }
}

const onClickAdd = () => {
    tagId.value = 0
    tagName.value = ''
    iconPath.value = ''
    showTagModal.value = true
}

useHead({
    title: 'ブログタグ編集',
})
</script>

<template>
    <main class="max-w-7xl mx-auto w-full p-4">
        <OrganismBlogEditHeader />
        <section
            id="tag-list"
            class="bg-white rounded p-4 my-4"
        >
            <h1 class="mb-4 font-bold text-xl text-center">
                タグ一覧
            </h1>

            <ul
                class="mb-8"
                @drop="onDrop"
                @touchend="onDrop"
                @dragenter.prevent
                @dragover.prevent
            >
                <li
                    v-for="(tag, index) in tags"
                    :key="index"
                    class="box-border flex w-full rounded px-4 py-1 bg-blue-500 text-white mt-2 justify-between"
                    :class="addClass(tag.status)"
                    draggable="true"
                    style="cursor: grab;"
                    @touchstart="onDragStart(index)"
                    @dragstart="onDragStart(index)"
                    @touchmove="onTouchmove($event)"
                    @dragenter="onDragEnter(index)"
                    @dragleave="onDragLeave()"
                    @dragend="onDragEnd()"
                >
                    <div class="flex items-center">
                        <i class="material-icons mr-2 text-2xl">drag_indicator</i>
                        <span>
                            {{ tag.label }}
                        </span>
                    </div>
                    <div class="flex items-center">
                        <button
                            class="flex px-2 py-2 cursor-default hover:bg-blue-700 rounded-full"
                            @click="onClickEdit(tag.id, tag.label, tag.icon_path)"
                        >
                            <i class="material-icons text-2xl">edit</i>
                        </button>
                        <button
                            class="flex px-2 py-2 cursor-default hover:bg-blue-700 rounded-full"
                            @click="onClickDelete(tag.id, tag.label)"
                        >
                            <i class="material-icons text-2xl">close</i>
                        </button>
                    </div>
                </li>
            </ul>

            <AtomButton
                label="新規追加"
                color="black"
                class="w-full border-dashed border-2 border-gray-700 mb-2 hover:bg-gray-200 "
                @click="onClickAdd"
            />

            <AtomButton
                label="保存"
                bg-color="blue-700"
                class="w-full"
            />
        </section>

        <OrganismTagRegisterModal
            v-model:show="showTagModal"
            v-model:id="tagId"
            v-model:name="tagName"
            v-model:image="iconPath"
        />
    </main>
</template>
