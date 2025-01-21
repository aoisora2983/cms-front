<script setup lang="ts">
const messageModal = useMessageModal()
</script>

<template>
    <div
        v-if="messageModal.isOpen"
        class="modal w-full h-full fixed top-0 left-0 flex justify-center overflow-y-auto"
    >
        <div
            class="overlay fixed top-0 left-0 bg-black opacity-70 w-screen h-screen"
            @click="messageModal.close"
        />

        <div class="modal-body max-w-4xl w-full bg-white m-4 p-8 rounded-sm h-fit">
            <h2 class="w-full text-2xl p-2 border-gray-800 border-b-2 mb-2 flex items-center">
                <i class="material-icons mr-2 text-2xl text-red-700">error</i>
                エラー
            </h2>

            <ul>
                <li
                    v-for="(message, index) in messageModal.messages"
                    :key="index"
                    class="border-b-2 my-2 last:border-b-0"
                >
                    <dl class="grid grid-cols-4 items-center ">
                        <dt class="p-2 col-span-1">
                            {{ message.name }}
                        </dt>
                        <dd class="p-2 col-span-3">
                            {{ message.reason }}
                        </dd>
                    </dl>
                </li>
            </ul>

            <div class="flex justify-end gap-2 p-2 border-gray-800 border-t-2">
                <AtomButton
                    label="OK"
                    color="white"
                    bg-color="blue-700"
                    @click="messageModal.close"
                />
            </div>
        </div>
    </div>
</template>
