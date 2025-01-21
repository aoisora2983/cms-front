<script setup lang="ts">
interface Head {
    fragment: string
    level: number
    label: string
    children: Array<Head>
}

interface Props {
    headList: Array<Head>
}

const props = withDefaults(defineProps<Props>(), {})

const headIsOpen = ref(false)
</script>

<template>
    <div
        class="bg-white rounded border border-gray-600 shadow"
    >
        <button
            type="button"
            class="w-full hover:bg-gray-200 rounded px-4 py-2"
            @click="headIsOpen = !headIsOpen"
        >
            <div class="flex items-center justify-center w-11/12">
                <i
                    class="material-icons text-2xl"
                >
                    keyboard_arrow_down
                </i>
                目次
            </div>
        </button>
        <ol
            v-if="headIsOpen"
            class="px-4 pb-4 pt-2"
        >
            <li
                v-for="(head, index) in props.headList"
                :key="index"
                class="flex flex-col py-2"
            >
                <NuxtLink
                    class="flex items-center before:mr-2 before:content-[''] before:border-4 before:border-stone-400 before:rounded-full before:w-4 before:h-4 hover:opacity-80"
                    :href="head.fragment"
                >
                    {{ head.label }}
                </NuxtLink>
                <ol v-if="head.children.length > 0">
                    <li
                        v-for="(childHead, childHeadIndex) in head.children"
                        :key="childHeadIndex"
                        class="pt-1"
                    >
                        <NuxtLink
                            class="flex items-center ml-1 before:mr-3 before:content-[''] before:border-4 before:border-stone-400 before:rounded-full before:w-2 before:h-2 hover:opacity-80"
                            :href="childHead.fragment"
                        >
                            {{ childHead.label }}
                        </NuxtLink>
                    </li>
                </ol>
            </li>
        </ol>
    </div>
</template>
