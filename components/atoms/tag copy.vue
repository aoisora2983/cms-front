<script setup lang="ts">
import { CHECK_LEVELS } from '~/constants/constants'

const levels = CHECK_LEVELS
</script>

<template>
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
                class="p-2 w-full block peer-checked:bg-green-300"
            >
                {{ level.label }}
            </label>
        </li>
    </ul>
</template>
