<script setup lang="ts">
interface Props {
    href: string
    label: string
    icon?: string
    color?: string
    bgColor?: string
    class?: string
}

const Props = withDefaults(defineProps<Props>(), {
    href: '',
    label: '',
    icon: '',
    color: 'white',
    bgColor: 'white',
    class: '',
})

const colorClass = `text-${Props.color} border-${Props.color} bg-${Props.bgColor} ${Props.class}`
</script>

<template>
    <NuxtLink
        :to="href"
        :class="colorClass"
        class="border hover:opacity-60 focus:ring-4 focus:ring-gray-300 rounded-sm px-5 py-2 flex items-center justify-center"
    >
        <i
            v-if="icon !== null"
            class="material-icons mr-2 text-2xl"
        >
            {{ icon }}
        </i>
        {{ label }}
    </NuxtLink>
</template>
