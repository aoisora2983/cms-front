<script setup lang="ts">
interface Header {
    label: string
    url: string
    icon: string
}

const headers: Header[] = [
    { label: 'Page', url: '/manage/blog', icon: 'description' },
    { label: 'Tag', url: '/manage/blog/tag', icon: 'sell' },
    { label: 'Comment', url: '/manage/blog/comment', icon: 'chat_bubble' },
    { label: 'Accessibility', url: '/manage/blog/accessibility', icon: 'accessibility_new' },
]

const route = useRoute()

const isActive = (url: string) => {
    if (route.fullPath == url) {
        return true
    }

    return false
}
</script>

<template>
    <div class="my-4">
        <ul class="flex flex-wrap bg-white rounded">
            <li
                v-for="(header, index) in headers"
                :key="index"
            >
                <NuxtLink
                    v-if="!isActive(header.url)"
                    :to="header.url"
                    class="flex py-2 px-4 opacity-60 hover:bg-gray-400 hover:opacity-100"
                >
                    <i class="material-icons mr-2 text-2xl">{{ header.icon }}</i>
                    <span>
                        {{ header.label }}
                    </span>
                </NuxtLink>
                <span
                    v-else
                    class="flex py-2 px-4"
                >
                    <i class="material-icons mr-2 text-2xl">{{ header.icon }}</i>
                    <span>
                        {{ header.label }}
                    </span>
                </span>
            </li>
        </ul>
    </div>
</template>
