<script setup lang="ts">
type Tag = {
    id: number
    label: string
    status: number | undefined
}

const STATUS_GHOST = 1

const masterTags = ref<Tag[]>([
    {
        id: 1,
        label: 'TEST1',
        status: 0,
    },
    {
        id: 2,
        label: 'TEST2',
        status: 0,
    },
    {
        id: 3,
        label: 'TEST3',
        status: 0,
    },
    {
        id: 4,
        label: 'TEST4',
        status: 0,
    },
]) // タグデータのマスタ
const tags = ref<Tag[]>(JSON.parse(JSON.stringify(masterTags.value))) // 表示用データ(シャドウ表示のために重複等を許可する)

const dragFromIndex = ref<number | null>(null)
const dragToIndex = ref<number | null>(null)

const onDragStart = (index: number) => {
    dragFromIndex.value = index // ドラッグしている(並べ替え対象の)アイテムの位置を格納
}

// ドラッグアイテムが別のアイテムの上に重なったら
const onDragEnter = (index: number) => {
    dragToIndex.value = index // 移動先indexを格納
    const array = tags.value
    let to = null
    if (dragFromIndex.value != index && dragFromIndex.value != null) { // 移動元と移動先が一緒 or 移動元情報が無ければ(画面外から別のドラッグをしているなら)処理しない
        to = JSON.parse(JSON.stringify(array[dragFromIndex.value])) // 移動元データをコピーし
        to.status = STATUS_GHOST // ゴースト設定

        if (dragFromIndex.value > index) { // 移動元が移動先より上なら、
            array.splice(dragToIndex.value, 0, to) // ゴーストを下に配置し
            array.splice(dragFromIndex.value + 1, 1) // 元データ削除して入れ替え先を表示
        }
        else {
            array.splice(dragToIndex.value + 1, 0, to) // ゴーストを上に配置
            array.splice(dragFromIndex.value, 1) // 元データ削除して入れ替え先を表示
        }
    }
}

// ドラッグアイテムが別のアイテムから離れたら
const onDragLeave = () => {
    // マスタデータで上書きしてゴーストを除去する
    tags.value = JSON.parse(JSON.stringify(masterTags.value))
}

// ドロップされたら、データを上書きする
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
    if (typeof status != 'undefined') {
        if (status == STATUS_GHOST) {
            return 'opacity-70'
        }
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
</script>

<template>
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
            style="cursor: grab"
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
        </li>
    </ul>
</template>
