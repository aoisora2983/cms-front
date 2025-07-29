<script setup lang="ts">
const config = useRuntimeConfig()
</script>

<template>
    <footer class="min-h-36 bg-slate-900">
        <div
            class="bg-slate-900 max-w-5xl pt-8 pb-8 lg:pb-4 px-4 lg:px-8 mx-auto flex flex-col text-white"
        >
            <div class="flex flex-col justify-between sm:flex-row">
                <ul class="flex items-center mr-6">
                    <li>
                        <NuxtLink
                            href="/blog/page/21"
                            class="flex items-center"
                        >
                            <i class="material-icons mr-2 text-2xl"> arrow_circle_right </i>
                            プライバシーポリシー
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
