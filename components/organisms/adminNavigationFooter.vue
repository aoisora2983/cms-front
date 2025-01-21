<script setup lang="ts">
const config = useRuntimeConfig()
</script>

<template>
    <footer class="h-20 bg-slate-900">
        <div
            class="max-w-5xl pt-8 pb-4 px-4 lg:px-8 text-right mx-auto text-white"
        >
            <p v-html="config.public.copyRight" />
        </div>
    </footer>
</template>
