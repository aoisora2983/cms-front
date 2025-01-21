<script setup lang="ts">
interface Props {
    id: number
    label?: string
    icon?: string
    disableLink?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    href: '',
    label: '',
    icon: '',
    disableLink: false,
})

const href = '/blog/tag/' + props.id
</script>

<template>
    <div class="relative">
        <NuxtLink
            :to="href"
            class="tag-image-link flex items-center rounded-l-full rounded-r-full pl-1 pr-4 py-1 bg-stone-600 hover:opacity-60 text-white"
            :class="disableLink ? 'pointer-events-none' : ''"
        >
            <div class="circle-image-wrapper">
                <NuxtImg
                    :alt="props.label + 'のアイコン'"
                    :src="'/uploader' + props.icon"
                    class="block bg-white p-1 w-7 h-7 mr-2"
                    width="28"
                    height="28"
                />
            </div>
            <span>
                {{ props.label }}
            </span>
        </NuxtLink>
    </div>
</template>
