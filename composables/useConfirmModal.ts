import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useConfirmModal = defineStore(
    'confirmModalStore',
    () => {
        const isOpen = ref(false)
        const message = ref('')
        const onOk = ref(() => {})

        function open(_message: string, _onOk: () => void) {
            isOpen.value = true
            message.value = _message
            onOk.value = _onOk
        }
        function close() {
            isOpen.value = false
            message.value = ''
            onOk.value = () => {}
        }
        return { isOpen, message, onOk, open, close }
    },
)
