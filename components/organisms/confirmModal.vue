<script setup lang="ts">
const confirmModal = useConfirmModal()
</script>

<template>
    <div
        v-if="confirmModal.isOpen"
        class="modal w-full h-full fixed top-0 left-0 flex justify-center overflow-y-auto"
    >
        <div
            class="overlay fixed top-0 left-0 bg-black opacity-70 w-screen h-screen"
            @click="confirmModal.close"
        />

        <div class="modal-body max-w-4xl w-full bg-white m-4 p-8 rounded-sm h-fit">
            <h2 class="w-full text-2xl p-2 border-gray-800 border-b-2 mb-2">
                確認モーダル
            </h2>

            <p
                class="my-4"
                v-html="confirmModal.message"
            />

            <div class="flex justify-end gap-2 p-2 border-gray-800 border-t-2">
                <AtomButton
                    label="OK"
                    color="white"
                    bg-color="blue-700"
                    @click="confirmModal.onOk"
                />
                <AtomButton
                    label="キャンセル"
                    color="black"
                    bg-color="white"
                    border-color="black"
                    @click="confirmModal.close"
                />
            </div>
        </div>
    </div>
</template>
