<script setup lang="ts">
interface Props {
    articleId: number
    replayId: number
    userName?: string
    time?: string
    comment: string
    good?: number
    status: number
}

const props = withDefaults(defineProps<Props>(), {
    userName: '',
    time: '',
    good: 0,
    count: 0,
})

const openCommentInput = ref(false)
const replayClass = ref('p-2 flex items-center text-gray-500 hover:text-gray-800 border border-gray-500 hover:border-gray-800 rounded-full')

const onClickReplay = () => {
    openCommentInput.value = !openCommentInput.value
    switchReplayClass()
}

const switchReplayClass = () => {
    if (openCommentInput.value) {
        replayClass.value = 'p-2 flex items-center text-gray-800 border border-gray-800 rounded-full'
    }
    else {
        replayClass.value = 'p-2 flex items-center text-gray-500 hover:text-gray-800 border border-gray-500 hover:border-gray-800 rounded-full'
    }
}
</script>

<template>
    <div>
        <div class="flex justify-between items-baseline py-2">
            <h3 class="font-semibold text-lg">
                {{ props.userName }}
            </h3>
            <time>{{ props.time }}</time>
        </div>
        <p class="break-words p-1 pb-4 whitespace-pre-wrap">
            {{ props.comment }}
        </p>
        <ul
            v-if="props.status == 1"
            class="flex justify-end items-center my-4 gap-2"
        >
            <li>
                <AtomCommentCountUpButton
                    :id="props.replayId"
                    :good="props.good"
                />
            </li>
            <li>
                <button
                    :class="replayClass"
                    @click="onClickReplay"
                >
                    <i class="material-icons text-2xl">
                        forum
                    </i>
                </button>
            </li>
        </ul>
        <div
            class="border-l-2 border-gray-400 mx-4 my-2 pl-8"
            :class="openCommentInput ? '' : 'hidden'"
        >
            <MoleculeCommentInput
                :article-id="props.articleId"
                :replay-id="props.replayId"
            />
        </div>
    </div>
</template>
