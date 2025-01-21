<script setup lang="ts">
interface Props {
    class?: string
    time?: string
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    class: '',
    time: '',
    disabled: false,
})

const time = ref(props.time)
const emits = defineEmits(['update:time'])

const onChange = () => {
    emits('update:time', time.value)
}
</script>

<template>
    <input
        v-model="time"
        type="time"
        :class="props.class"
        class="disabled:opacity-50 border-gray-300"
        :disabled="props.disabled"
        @change="onChange"
    >
</template>
