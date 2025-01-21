import { ref } from 'vue'
import { defineStore } from 'pinia'
import { CORRECT_NO_CHECK } from '~/constants/constants'
import type { CorrectStatus, Replace } from '~/api/models/blog/correct'

export const useCorrectModal = defineStore(
    'correctModalStore',
    () => {
        const isOpen = ref(false)
        const level = ref(CORRECT_NO_CHECK)
        const message = ref('')
        const replace = ref([] as Array<Replace>)
        const sentence = ref('')
        const onReplace = ref(() => {})
        const onIgnore = ref(() => {})
        const onCancel = ref(() => {})

        function open(
            correct: CorrectStatus,
            _onReplace: () => void,
            _onIgnore: () => void,
            _onCancel: () => void,
        ) {
            isOpen.value = true
            level.value = correct.level
            message.value = correct.message
            replace.value = correct.replace
            sentence.value = correct.sentence
            onReplace.value = _onReplace
            onIgnore.value = _onIgnore
            onCancel.value = _onCancel
        }
        function close() {
            isOpen.value = false
            message.value = ''
            level.value = CORRECT_NO_CHECK
            replace.value = [] as Array<Replace>
            sentence.value = ''
            onReplace.value = () => undefined
            onIgnore.value = () => undefined
            onCancel.value = () => undefined
        }
        return { isOpen, level, message, replace, sentence, onReplace, onIgnore, onCancel, open, close }
    },
)
