<script setup lang="ts">
interface Props {
    id: string
    label?: string
    placeholder?: string
    input: string
}

const props = withDefaults(defineProps<Props>(), {
    label: '',
    placeholder: '',
})

const emits = defineEmits(
    [
        'update:input',
    ],
)

const inputText = ref(props.input)
const onInput = () => {
    emits('update:input', inputText.value)
}
</script>

<template>
    <div>
        <label
            class="text-gray-700 font-bold pl-1 mb-2"
            :for="props.id"
        >
            {{ props.label }}
        </label>
        <input
            :id="props.id"
            v-model="inputText"
            type="text"
            class="border border-gray-300 rounded-sm w-full py-2 px-3 text-gray-700"
            :placeholder="props.placeholder"
            @input="onInput"
        >
    </div>
</template>
