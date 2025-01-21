<script setup lang="ts">
import { getAccessibilityList } from '~/api/apis/blog/getAccessibilityList'
import type { Accessibility } from '~/api/models/blog/accessibility'
import { CORRECT_NG, CORRECT_NO_CHECK, CORRECT_WARNING } from '~/constants/constants'

definePageMeta({ layout: 'admin' })

const accessibilityList: Accessibility[] = await getAccessibilityList()

const levels = [
    {
        id: CORRECT_NO_CHECK,
        label: 'チェック無',
    },
    {
        id: CORRECT_WARNING,
        label: '警告',
    },
    {
        id: CORRECT_NG,
        label: '禁止',
    },
]

const input = ref(accessibilityList)

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
            <ul class="grid grid-cols-1 md:grid-cols-3">
                <li
                    v-for="(accessibility, index) in accessibilityList"
                    :key="index"
                    class="p-4"
                >
                    <dl class="border rounded">
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
                            <ul class="grid grid-cols-3 justify-items-center border">
                                <li
                                    v-for="(level, levelIndex) in levels"
                                    :key="levelIndex"
                                    class="w-full text-center [&:not(:last-child)]:border-r"
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
                                        class="p-2 w-full block peer-checked:bg-green-300"
                                    >
                                        {{ level.label }}
                                    </label>
                                </li>
                            </ul>
                        </dd>
                        <dd
                            class="px-4 pb-4"
                        >
                            <label class="font-bold">
                                置換文字
                            </label>
                            <div>
                                <NuxtLink
                                    class="block p-4 w-full text-white bg-blue-700 hover:opacity-80"
                                    :href="'/manage/blog/accessibility/replace/' + accessibility.id"
                                >
                                    文字を登録・編集する
                                </NuxtLink>
                            </div>
                        </dd>
                    </dl>
                </li>
            </ul>
        </section>
    </main>
</template>
