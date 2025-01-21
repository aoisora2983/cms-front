import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useInfoModal = defineStore(
    'infoModalStore',
    () => {
        const isOpen = ref(false)
        const message = ref('')
        const onOk = ref(() => undefined)

        function open(_message: string, _onOk: () => undefined) {
            isOpen.value = true
            message.value = _message
            onOk.value = _onOk
        }
        function close() {
            onOk.value()
            isOpen.value = false
            message.value = ''
            onOk.value = () => undefined
        }
        return { isOpen, message, onOk, open, close }
    },
)
