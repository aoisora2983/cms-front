<script setup lang="ts">
import type { NuxtError } from '#app'

interface Props {
    error: NuxtError
}
const props = defineProps<Props>()

let errorMessage = '以下の情報をコピーして問合せてください。'
if (props.error.statusCode == 404) {
    errorMessage = 'このページは存在しないか削除されました。\nトップページに戻って情報をお探しください。'
}
</script>

<template>
    <main class="w-full">
        <section
            id="about-this-site"
            class="bg-gray-50"
        >
            <div class="min-h-screen flex items-center max-w-5xl mx-auto py-20">
                <div class="flex-grow p-4">
                    <h1 class="text-4xl font-bold text-center mb-4">
                        エラーが発生しました。
                    </h1>
                    <p class="whitespace-pre-wrap py-4 text-center">
                        {{ errorMessage }}
                    </p>
                    <div class="py-2 text-center">
                        <dl class="flex py-4 my-2 border-y border-black">
                            <dt>
                                ステータスコード
                            </dt>
                            <dd class="ml-6">
                                {{ props.error.statusCode }}
                            </dd>
                        </dl>
                        <dl class="flex py-4 my-2 border-b border-black">
                            <dt>
                                エラーメッセージ
                            </dt>
                            <dd class="ml-6">
                                {{ props.error.message }}
                            </dd>
                        </dl>
                    </div>
                    <div class="mt-8 w-full">
                        <NuxtLink
                            class="p-4 block text-center border border-black w-full bg-white rounded hover:bg-gray-100"
                            href="/"
                        >
                            HOMEに戻る
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>
