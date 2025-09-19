<script setup lang="ts">
import { registerOpinion } from '~/api/apis/opinion/registerOpinion'

const title = 'サイトに関するご意見・お問合せ・不具合等の送信フォーム'
const description = 'サイトやツールに関するご意見・お問合せ・不具合報告はこちらのフォームから送信してください。1か月以内を目標に回答しますが、不適切な内容には回答しない可能性があることをご了承ください。'

useHead({
    title: title,
    meta: [
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
    ],
})

useSeoMeta({
    description: description,
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
            class="max-w-5xl mx-auto p-4 mt-10 sm:mt-32 leading-relaxed"
        >
            <h1 class="text-2xl sm:text-4xl font-bold mb-6 text-center">
                お問合せ
            </h1>
            <p style="text-indent: 1rem">
                サイトやツールに関するご意見、ご要望、不具合報告は以下のフォームからお送りください。<br>
                問合せを頂いてから1か月以内を目標に回答しますが、以下のような内容には回答しない可能性がございます。
            </p>
            <ul class="ml-6 mt-1 list-disc">
                <li>宗教等に関する内容。</li>
                <li>誹謗中傷等不適切な内容。</li>
                <li>サイトやツール、制作物に関係のない内容。</li>
                <li>メールアドレスに不備がある。</li>
            </ul>
            <h2 class="text-xl font-bold p-2 mb-2 mt-4 border-b-2 border-gray-800">
                お問合せ内容
            </h2>
            <div
                v-if="!sended"
                class="flex flex-col gap-4 p-4 mb-20 sm:mb-40"
            >
                <div class="flex flex-col sm:flex-row">
                    <label
                        for="input-name"
                        class="w-full sm:w-1/4"
                    > お名前 </label>
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
                    > メールアドレス </label>
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
                    > 問い合わせ内容 </label>
                    <textarea
                        id="input-opinion"
                        v-model="input.content"
                        rows="8"
                        class="flex-grow border border-gray-500 rounded shadow"
                        placeholder="ご要望など"
                    />
                </div>
                <button
                    type="button"
                    class="rounded py-2 bg-black text-white px-4 flex justify-center align-middle hover:opacity-50"
                    :disabled="clickSended ? true : false"
                    @click="onClickSend"
                >
                    <i class="material-icons mr-2 text-2xl"> mail </i>
                    送信
                </button>
            </div>
            <p v-if="sended">
                お問い合わせありがとうございました。
            </p>
        </section>
    </main>
</template>
