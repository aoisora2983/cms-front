<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import VueTailwindDatepicker from 'vue-tailwind-datepicker'
import { DATE_FORMAT, TIME_FORMAT } from '~/constants/constants'

dayjs.extend(customParseFormat)

interface Props {
    datetime: Dayjs
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
})

const datetime = ref(props.datetime ?? dayjs())
const date = ref(datetime.value.format(DATE_FORMAT))
const time = ref(datetime.value.format(TIME_FORMAT))

const emits = defineEmits(['update:datetime'])

const onChange = () => {
    const _datetime = date.value + ' ' + time.value
    const parseDateTime = dayjs(_datetime, DATE_FORMAT + ' ' + TIME_FORMAT)
    emits('update:datetime', parseDateTime)
}
</script>

<template>
    <div class="flex flex-col md:flex-row gap-2">
        <div class="relative flex-grow w-full md:w-auto">
            <vue-tailwind-datepicker
                v-model="date"
                as-single
                :formatter="({
                    date: 'YYYY年MM月DD日',
                    month: 'MMM',
                })"
                input-classes="w-full border border-gray-300 rounded-sm"
                :disabled="props.disabled"
                @update:model-value="onChange"
            />
        </div>
        <div class="w-full md:w-auto">
            <AtomInputTime
                v-model:time="time"
                class="w-full rounded-sm"
                :disabled="props.disabled"
                @change="onChange"
            />
        </div>
    </div>
</template>
