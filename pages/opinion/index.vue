<script setup lang="ts">
import { registerOpinion } from '~/api/apis/opinion/registerOpinion'

useHead({
    title: 'お問合せ',
})

useSeoMeta({
    description: `お問合せはこちらから。`,
})

const loading = useLoading()
const clickSended = ref(false)
const sended = ref(false)

const input = ref({
    name: '',
    email: '',
    content: '',
})

const onClickSend = async () => {
    loading.load()
    clickSended.value = false

    try {
        await registerOpinion({
            name: input.value.name,
            email: input.value.email,
            content: input.value.content,
        })
        sended.value = true
    }
    catch (error) {
        console.log(error)
    }
    finally {
        loading.unload()
    }
}
</script>

<template>
    <main class="w-full">
        <section
            id="blog-list"
            class="max-w-5xl mx-auto p-4 mt-32"
        >
            <h1 class="text-4xl sm:text-6xl font-bold mb-8 text-center">
                お問合せ
            </h1>
            <div
                v-if="!sended"
                class="flex flex-col gap-4 p-4 mb-40"
            >
                <div class="flex flex-col sm:flex-row">
                    <label
                        for="input-name"
                        class="w-full sm:w-1/4"
                    >
                        お名前
                    </label>
                    <input
                        id="input-name"
                        v-model="input.name"
                        class="flex-grow border border-gray-500 rounded shadow"
                        type="text"
                        placeholder="John Doe"
                    >
                </div>
                <div class="flex flex-col sm:flex-row">
                    <label
                        for="input-address"
                        class="w-full sm:w-1/4"
                    >
                        メールアドレス
                    </label>
                    <input
                        id="input-address"
                        v-model="input.email"
                        class="flex-grow border border-gray-500 rounded shadow"
                        type="email"
                        placeholder="example@example.com"
                    >
                </div>
                <div class="flex flex-col sm:flex-row">
                    <label
                        for="input-opinion"
                        class="w-full sm:w-1/4"
                    >
                        問い合わせ内容
                    </label>
                    <textarea
                        id="input-opinion"
                        v-model="input.content"
                        class="flex-grow border border-gray-500 rounded shadow"
                        placeholder="ご要望など"
                    />
                </div>
                <button
                    type="button"
                    class="rounded py-2 bg-black text-white px-4 flex justify-center align-middle"
                    :disabled="clickSended ? true : false"
                    @click="onClickSend"
                >
                    <i class="material-icons mr-2 text-2xl">
                        mail
                    </i>
                    送信
                </button>
            </div>
            <p v-if="sended">
                お問い合わせありがとうございました。
            </p>
        </section>
    </main>
</template>
