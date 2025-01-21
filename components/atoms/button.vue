<script setup lang="ts">
interface Props {
    label: string
    icon?: string
    color?: string
    bgColor?: string
    borderColor?: string
    class?: string
}

const Props = withDefaults(defineProps<Props>(), {
    href: '',
    label: '',
    icon: '',
    color: 'white',
    bgColor: 'white',
    borderColor: '',
    class: '',
})

let colorClass = `text-${Props.color} bg-${Props.bgColor} ${Props.class}`
if (Props.borderColor) {
    colorClass += `border border-${Props.borderColor}`
}
</script>

<template>
    <button
        :class="colorClass"
        class="hover:opacity-80 focus:ring-4 focus:ring-gray-300 rounded-sm px-5 py-2 flex items-center justify-center"
    >
        <i
            v-if="icon !== ''"
            class="material-icons mr-2 text-2xl"
        >
            {{ icon }}
        </i>
        {{ label }}
    </button>
</template>
