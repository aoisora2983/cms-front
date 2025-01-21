<script setup lang="ts">
const loading = useLoading()
</script>

<template>
    <div
        v-if="loading.isLoading"
        class="modal w-full h-full z-20 fixed top-0 left-0 flex justify-center items-center"
    >
        <div
            class="overlay fixed top-0 left-0 bg-black opacity-70 w-screen h-screen"
        />

        <div
            class="loading"
        />
    </div>
</template>
