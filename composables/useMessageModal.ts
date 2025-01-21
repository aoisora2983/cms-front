import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ErrorMessage } from '~/api/fetch'

export const useMessageModal = defineStore(
    'messageModalStore',
    () => {
        const messages = ref([
            {
                name: '',
                reason: '',
            },
        ])
        const isOpen = ref(false)
        function setMessages(_messages: ErrorMessage[]) {
            messages.value = _messages
            isOpen.value = true
        }
        function open() {
            isOpen.value = true
        }
        function close() {
            isOpen.value = false
        }
        return { messages, isOpen, setMessages, open, close }
    },
)
