<script setup lang="ts">
import type { Breadcrumb } from '~/api/models/common'

interface Props {
    breadcrumb: Breadcrumb[]
}

const Props = withDefaults(defineProps<Props>(), {})
</script>

<template>
    <nav
        aria-label="Breadcrumb"
        class="breadcrumb text-gray-500"
    >
        <ul
            class="flex ml-2 overflow-auto whitespace-nowrap"
        >
            <li
                v-for="(item, itemIndex) in breadcrumb"
                :key="itemIndex"
                class="[&:not(:first-child)]:before:content-['>']"
            >
                <NuxtLink
                    v-if="item.link != ''"
                    class="px-2 hover:underline"
                    :href="item.link"
                >
                    {{ item.label }}
                </NuxtLink>
                <span
                    v-else
                    class="px-2 text-gray-900"
                >
                    {{ item.label }}
                </span>
            </li>
        </ul>
    </nav>
</template>
