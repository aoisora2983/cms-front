<script setup lang="ts">
const config = useRuntimeConfig()
</script>

<template>
    <footer class="min-h-36 bg-slate-900">
        <div
            class="bg-slate-900 max-w-5xl pt-8 pb-8 lg:pb-4 px-4 lg:px-8 mx-auto flex flex-col text-white"
        >
            <div class="flex flex-col justify-between sm:flex-row">
                <ul class="flex flex-col sm:flex-row items-center sm:mr-6">
                    <li class="w-full sm:w-auto">
                        <NuxtLink
                            href="/blog/page/1"
                            class="flex items-center hover:opacity-60"
                        >
                            <i class="material-icons mr-2 text-2xl"> arrow_circle_right </i>
                            <p>このサイトについて</p>
                        </NuxtLink>
                    </li>
                    <li class="w-full sm:w-auto border-t-2 border-dashed sm:border-0 pt-2 sm:pt-0 mt-2 sm:mt-0 sm:ml-2 hover:opacity-60">
                        <NuxtLink
                            href="/blog/page/21"
                            class="flex items-center"
                        >
                            <i class="material-icons mr-2 text-2xl"> arrow_circle_right </i>
                            <p>プライバシーポリシー</p>
                        </NuxtLink>
                    </li>
                </ul>
                <div class="mt-4 sm:mt-0">
                    <AtomLinkButton
                        href="/opinion"
                        label="お問合せ"
                        icon="mail"
                        color="black"
                    />
                </div>
            </div>
            <div class="flex justify-end mt-4">
                <p v-html="config.public.copyRight" />
            </div>
        </div>
    </footer>
</template>
