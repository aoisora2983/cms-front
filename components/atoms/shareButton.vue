<script setup lang="ts">
const url = useRequestURL()
const onClicked = ref(false)

const onClickShare = () => {
    onClicked.value = !onClicked.value
}

const onClickOutsideShare = () => {
    if (onClicked.value) {
        onClicked.value = false
    }
}

const onClickTooltip = (event: Event) => {
    if (!event) {
        return
    }

    if (!event.target) {
        return
    }

    const target = event.target as HTMLInputElement
    target.select()
}
</script>

<template>
    <div
        v-click-outside="onClickOutsideShare"
        class="relative"
    >
        <div
            v-if="onClicked"
            class="absolute bottom-full right-0 share-tooltip text-white flex items-center bg-gray-900 p-4 mb-2 rounded opacity-80"
        >
            <i class="material-icons text-2xl mr-2">
                link
            </i>
            <input
                ref="target"
                type="text"
                class="bg-gray-900"
                :value="url.href"
                readonly
                @click="onClickTooltip"
            >
        </div>
        <button
            class="p-2 flex items-center text-gray-500 hover:text-gray-800 border border-gray-500 hover:border-gray-800 rounded-full"
            @click="onClickShare"
        >
            <i class="material-icons text-2xl">
                share
            </i>
        </button>
    </div>
</template>

<style lang="css" scoped>
.share-tooltip:before {
    content: '';
    position: absolute;
    bottom: -4px;
    right: 20px;
    transform: rotate(45deg);
    width: 8px;
    height: 8px;
    background-color: rgb(17 24 39 / var(--tw-bg-opacity, 1));
}
</style>
