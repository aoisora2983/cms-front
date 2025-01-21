<script setup lang="ts">
import { getAccessibilityList } from '~/api/apis/blog/getAccessibilityList'
import { registerAccessibilityList } from '~/api/apis/blog/registerAccessibilityList'
import type { Accessibility } from '~/api/models/blog/accessibility'
import { CHECK_LEVELS } from '~/constants/constants'

definePageMeta({ layout: 'admin' })

const loading = useLoading()
const accessibilityList: Accessibility[] = await getAccessibilityList()
const levels = CHECK_LEVELS
const input = ref(accessibilityList)

const onClickSave = async () => {
    loading.load()
    try {
        await registerAccessibilityList({
            accessibilityList: accessibilityList,
        })
    }
    catch (error) {
        console.log(error)
    }
    finally {
        loading.unload()
    }
}

useHead({
    title: 'アクセシビリティ管理',
})
</script>

<template>
    <main class="max-w-7xl mx-auto w-full p-4">
        <OrganismBlogEditHeader />
        <section class="bg-white rounded p-4 my-4">
            <h1 class="mb-4 font-bold text-xl text-center">
                アクセシビリティ管理
            </h1>
            <ul class="grid grid-cols-1 md:grid-cols-2">
                <li
                    v-for="(accessibility, index) in accessibilityList"
                    :key="index"
                    class="m-4 border border-gray-300 rounded"
                >
                    <dl>
                        <dt class="bg-gray-200 p-4 text-center">
                            {{ accessibility.title }}
                        </dt>
                        <dd class="p-4">
                            <AtomInputText
                                :id="'accessibility-message-' + index"
                                v-model="input[index].message"
                                label="エラーメッセージ"
                                :placeholder="accessibility.message"
                                :input="accessibility.message"
                            />
                        </dd>
                        <dd
                            class="px-4 pb-4"
                        >
                            <label class="font-bold">
                                チェックレベル
                            </label>
                            <ul class="grid grid-cols-3 justify-items-center border border-gray-300 rounded">
                                <li
                                    v-for="(level, levelIndex) in levels"
                                    :key="levelIndex"
                                    class="w-full text-center [&:not(:last-child)]:border-r border-gray-300"
                                >
                                    <input
                                        :id="'level-' + index + '-' + levelIndex"
                                        v-model="input[index].level"
                                        :name="'level-' + index"
                                        :value="level.id"
                                        class="hidden peer"
                                        type="radio"
                                    >
                                    <label
                                        :for="'level-' + index + '-' + levelIndex"
                                        class="flex items-center justify-center p-2 w-full h-full peer-checked:bg-green-300"
                                    >
                                        {{ level.label }}
                                    </label>
                                </li>
                            </ul>
                        </dd>
                        <dd
                            v-if="accessibility.is_replace"
                            class="px-4 pb-4"
                        >
                            <label class="font-bold">
                                置換文字
                            </label>
                            <div>
                                <NuxtLink
                                    class="block px-4 py-2 w-full text-white bg-blue-700 hover:opacity-80 rounded text-center"
                                    :href="'/manage/blog/accessibility/replace/' + accessibility.id"
                                >
                                    文字を登録・編集する
                                </NuxtLink>
                            </div>
                        </dd>
                    </dl>
                </li>
            </ul>
            <div class="w-full flex justify-end">
                <AtomButton
                    label="保存"
                    color="white"
                    bg-color="blue-700"
                    @click="onClickSave"
                />
            </div>
        </section>
    </main>
</template>
