import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoading = defineStore(
    'loadingStore',
    () => {
        const isLoading = ref(false)
        function load() {
            isLoading.value = true
        }
        function unload() {
            isLoading.value = false
        }
        return { isLoading, load, unload }
    },
)
