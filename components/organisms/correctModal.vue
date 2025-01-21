<script setup lang="ts">
import { CORRECT_NG, CORRECT_WARNING } from '~/constants/constants'

const correctModal = useCorrectModal()
</script>

<template>
    <div
        v-if="correctModal.isOpen"
        class="modal w-full h-full fixed top-0 left-0 flex justify-center overflow-y-auto"
    >
        <div
            class="overlay fixed top-0 left-0 bg-black opacity-70 w-screen h-screen"
            @click="correctModal.close"
        />

        <div class="modal-body max-w-4xl w-full bg-white m-4 p-8 rounded-sm h-fit">
            <h2 class="w-full text-2xl p-2 border-gray-800 border-b-2 mb-2">
                <span v-if="correctModal.level == CORRECT_NG">
                    エラー
                </span>
                <span v-else>
                    警告
                </span>
            </h2>

            <p class="my-4">
                {{ correctModal.message }}
            </p>

            <!--  -->
            <div v-if="correctModal.replace.length > 0">
                <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    <li
                        v-for="(replace, index) in correctModal.replace"
                        :key="index"
                        class="flex border-t-2 border-b-2 p-2 gap-4 justify-center items-center"
                    >
                        <span>
                            {{ replace.from }}
                        </span>

                        <i class="material-icons mr-2 text-2xl text-gray-800">
                            arrow_forward
                        </i>

                        <span>
                            {{ replace.to }}
                        </span>
                    </li>
                </ul>
                <p class="text-right mb-2">
                    ※左から右に置換します。
                </p>
            </div>

            <div class="flex justify-end gap-2 p-2 border-gray-800 border-t-2">
                <AtomButton
                    v-if="correctModal.replace.length > 0"
                    label="置き換えて登録"
                    color="white"
                    bg-color="blue-700"
                    @click="correctModal.onReplace"
                />

                <AtomButton
                    v-if="correctModal.level == CORRECT_WARNING"
                    label="警告を無視して登録"
                    color="white"
                    bg-color="blue-700"
                    @click="correctModal.onIgnore"
                />

                <AtomButton
                    label="手動で修正"
                    color="black"
                    bg-color="white"
                    border-color="black"
                    @click="correctModal.onCancel"
                />
            </div>
        </div>
    </div>
</template>
