<script setup lang="ts">
const config = useRuntimeConfig()
</script>

<template>
    <footer class="h-36 bg-slate-900">
        <div
            class="max-w-5xl pt-8 pb-8 lg:pb-4 px-4 lg:px-8 justify-between items-center mx-auto grid grid-cols-2 text-white"
        >
            <p v-html="config.public.copyRight" />
            <div class="flex justify-end">
                <AtomLinkButton
                    href="/opinion"
                    label="お問合せ"
                    icon="mail"
                    color="black"
                />
            </div>
        </div>
    </footer>
</template>
