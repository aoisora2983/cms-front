<script setup lang="ts">
import { countUpComment } from '~/api/apis/blog/countUpComment'

interface Props {
    id: number
    good?: number
}

const props = withDefaults(defineProps<Props>(), {
    good: 0,
})

const clicked = ref(false)
const good = ref(props.good)
const onClickFavorite = async () => {
    if (!clicked.value) {
        try {
            await countUpComment({
                id: props.id,
            })
            good.value++
        }
        catch (error) {
            console.log(error)
        }
    }

    clicked.value = true
}
</script>

<template>
    <button
        class="py-2 px-4 flex items-center text-gray-500 hover:text-gray-800 border border-gray-500 hover:border-gray-800 rounded-full"
        @click="onClickFavorite"
    >
        <i class="material-icons mr-2 text-2xl text-pink-600">
            favorite
        </i>
        <span class="ml-1">{{ good }}</span>
    </button>
</template>
