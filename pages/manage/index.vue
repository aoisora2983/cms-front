<script setup>
import { ErrorMessages } from '~/api/fetch'

definePageMeta({ layout: 'admin' })

const { login } = useAuth()
const messageModal = useMessageModal()

const credentials = reactive({
    mail: '',
    password: '',
})

async function onSubmit() {
    try {
        await login(credentials)
        navigateTo('/manage/dashboard', { external: true })
    }
    catch (error) {
        if (error instanceof ErrorMessages) {
            messageModal.setMessages(error.messages)
        }
    }
}

useHead({
    title: 'ログイン',
})
</script>

<template>
    <main class="flex items-center content-center p-4 flex-grow">
        <section class="w-96 max-w-2xl mx-auto border bg-white p-8 rounded">
            <form
                class="flex flex-col"
                @submit.prevent="onSubmit"
            >
                <div class="flex flex-col mb-4 p-1">
                    <label for="mail">
                        メール
                    </label>
                    <input
                        id="mail"
                        v-model="credentials.mail"
                        type="text"
                        class="border border-gray-300 text-gray-900 rounded block w-full p-2.5"
                    >
                </div>
                <div class="flex flex-col mb-4 p-1">
                    <label for="password">
                        パスワード
                    </label>
                    <input
                        id="password"
                        v-model="credentials.password"
                        type="password"
                        class="border border-gray-300 text-gray-900 rounded block w-full p-2.5"
                    >
                </div>
                <div class="text-right">
                    <input
                        type="submit"
                        value="ログイン"
                        class="text-white bg-black border border-black hover:opacity-80 rounded-sm px-5 py-2.5 me-2 mb-2 cursor-pointer"
                    >
                </div>
            </form>
        </section>
    </main>
</template>
