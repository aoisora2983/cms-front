<script setup lang="ts">
interface Head {
    fragment: string
    level: number
    label: string
    children: Array<Head>
}

interface Props {
    headList: Array<Head>
    isOpen: boolean
}

const props = withDefaults(defineProps<Props>(), {
    isOpen: false,
})

const headIsOpen = ref(props.isOpen)
</script>

<template>
    <nav
        class="bg-white border border-gray-600 shadow rounded"
        :class="props.isOpen ? 'w-full' : headIsOpen ? 'md:w-1/2' : ''"
    >
        <button
            type="button"
            class="w-full px-4 py-2"
            :class="props.isOpen ? 'pointer-events-none bg-gray-200' : headIsOpen ? 'bg-gray-200' : 'h-full hover:bg-gray-200'"
            @click="headIsOpen = !headIsOpen"
        >
            <div
                class="flex items-center justify-center"
                :class="headIsOpen ? 'w-11/12' : ''"
            >
                <i
                    class="material-icons text-2xl"
                >
                    {{ props.isOpen ? 'list' : headIsOpen ? 'keyboard_arrow_up' : 'list' }}
                </i>
                <p class="ml-2">
                    目次
                </p>
            </div>
        </button>
        <ol
            :class="headIsOpen ? '' : 'hidden'"
            class="px-4 pb-4 pt-2"
        >
            <li
                v-for="(head, index) in props.headList"
                :key="index"
                class="flex flex-col py-2"
            >
                <NuxtLink
                    class="underline flex items-center before:mr-2 before:content-[''] before:border-4 before:border-stone-400 before:rounded-full before:w-4 before:h-4 hover:opacity-70"
                    :href="head.fragment"
                    @click="props.isOpen ? headIsOpen=true : headIsOpen=false"
                >
                    {{ head.label }}
                </NuxtLink>
                <ol v-if="head.children.length > 0">
                    <li
                        v-for="(childHead, childHeadIndex) in head.children"
                        :key="childHeadIndex"
                        class="pt-2"
                    >
                        <NuxtLink
                            class="underline flex items-center ml-4 pt-1 before:mr-3 before:content-[''] before:border-4 before:border-stone-400 before:rounded-full before:w-2 before:h-2 hover:opacity-70"
                            :href="childHead.fragment"
                            @click="props.isOpen ? headIsOpen=true : headIsOpen=false"
                        >
                            {{ childHead.label }}
                        </NuxtLink>
                    </li>
                </ol>
            </li>
        </ol>
    </nav>
</template>
