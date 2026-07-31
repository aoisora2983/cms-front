<script setup lang="ts">
const url = useRequestURL()
const config = useRuntimeConfig()

const onClicked = ref(false)

const thisUrl = config.public.siteUrl + url.pathname

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
    <ul class="flex items-center gap-2 ml-2">
        <li>
            <a
                :href="'https://bsky.app/intent/compose?text=' + thisUrl"
                target="_blank"
                rel="noopener"
                class="p-2 flex items-center"
            >
                <NuxtImg
                    src="/img/logo-bluesky.svg"
                    alt="BlueSkyで共有する"
                    width="24"
                    height="24"
                />
            </a>
        </li>
        <li>
            <a
                :href="'https://b.hatena.ne.jp/add?mode=confirm&url=' + thisUrl"
                target="_blank"
                rel="noopener"
                class="p-2 flex items-center"
            >
                <NuxtImg
                    src="/img/hatenabookmark_symbolmark.png"
                    alt="Hatenaで共有する"
                    width="24"
                    height="24"
                />
            </a>
        </li>
        <li
            v-click-outside="onClickOutsideShare"
            class="relative"
        >
            <div
                class="z-10 absolute bottom-full right-0 share-tooltip text-white flex items-center bg-gray-900 p-4 mb-2 rounded opacity-80"
                :class="onClicked ? '' : 'hidden'"
            >
                <i class="material-icons text-2xl mr-2">
                    link
                </i>
                <input
                    ref="target"
                    type="text"
                    class="bg-gray-900"
                    :value="thisUrl"
                    readonly
                    @click="onClickTooltip"
                >
            </div>
            <button
                class="p-2 flex items-center text-gray-500 hover:text-gray-800"
                @click="onClickShare"
            >
                <i class="material-icons w-6 h-6">
                    share
                </i>
            </button>
        </li>
    </ul>
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
