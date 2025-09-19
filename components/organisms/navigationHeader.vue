<script setup lang="ts">
import { getTagList } from '~/api/apis/blog/getTagList'

interface Header {
    label: string
    url: string
    strict: boolean
    icon: string
}

const headers: Header[] = [
    { label: 'HOME', url: '/', strict: true, icon: 'home' },
    { label: 'Portfolio', url: '/portfolio', strict: true, icon: 'work' },
    { label: 'Blog', url: '/blog', strict: true, icon: 'description' },
    { label: 'Tools', url: '/tools', strict: true, icon: 'service_toolbox' },
]

const route = useRoute()
const isOpen = ref(false)
const config = useRuntimeConfig()
const openSearch = ref(false)
const searchKeyword = ref('')

const tagList = await getTagList()

const isActive = (url: string, strict: boolean) => {
    if (strict) {
        if (route.fullPath == url) {
            return true
        }
    }
    else {
        if (route.fullPath.match(url)) {
            return true
        }
    }

    return false
}

const onClickOutside = () => {
    isOpen.value = false
}

const keydownSearch = async (event: KeyboardEvent) => {
    if (!event) {
        return
    }

    if (!event.code) {
        return
    }

    if (event.code == 'Enter') {
        searchGoogle()
    }
}

const searchGoogle = () => {
    let query = 'q=' + searchKeyword.value
    query += '&cx=' + config.public.googleSearch
    query += '&ie=UTF-8'
    navigateTo('/search?' + query, { external: true })
    openSearch.value = false
}
</script>

<template>
    <header class="bg-white border-b-2 fixed w-full top-0 z-50 h-20">
        <div
            v-click-outside="onClickOutside"
            class="max-w-5xl pt-8 pb-1 px-4 lg:px-8 items-center justify-between mx-auto grid grid-cols-2"
        >
            <div>
                <NuxtLink
                    href="/"
                    class="block w-min"
                >
                    <AtomLogo
                        class="logo w-16"
                        :alt="config.public.siteTitle + 'のロゴ画像'"
                    />
                </NuxtLink>
            </div>
            <nav class="flex justify-end items-center">
                <div class="flex items-center mr-4 rounded-full border-gray-400 border-2">
                    <button
                        class="flex items-center"
                        @click="openSearch = !openSearch"
                    >
                        <span
                            class="py-1 border-none w-12 rounded-l-full"
                            type="text"
                        >
                            _
                        </span>
                        <i class="py-1 px-2 material-icons text-2xl">search</i>
                    </button>
                </div>

                <div>
                    <input
                        id="accordion"
                        v-model="isOpen"
                        type="checkbox"
                        class="hidden"
                    >
                    <label
                        id="accordion-label"
                        for="accordion"
                    >
                        <span /><span /><span />
                    </label>
                    <ul
                        class="accordion-target lg:flex lg:justify-end lg:text-lg"
                    >
                        <li
                            v-for="(header, index) in headers"
                            :key="index"
                        >
                            <NuxtLink
                                v-if="!isActive(header.url, header.strict)"
                                class="hover:opacity-80 px-4 py-2 rounded-full flex justify-start items-center"
                                :to="header.url"
                            >
                                <i class="material-icons mr-2 text-2xl">{{ header.icon }}</i>
                                <span>
                                    {{ header.label }}
                                </span>
                            </NuxtLink>
                            <span
                                v-else
                                class="px-4 py-2 opacity-50 flex justify-start items-center"
                            >
                                <i class="material-icons mr-2 text-2xl">{{ header.icon }}</i>
                                <span>
                                    {{ header.label }}
                                </span>
                            </span>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
        <div
            :class="openSearch ? '' : 'hidden'"
            class="w-screen h-screen bg-stone-100 absolute top-0 overflow-y-auto"
            style="z-index: 101"
        >
            <div class="max-w-4xl pt-8 pb-1 px-4 lg:px-8 items-center justify-between mx-auto relative">
                <button
                    class="absolute right-0 top-0 mt-10 mr-8 rounded-full bg-stone-600 hover:opacity-60"
                    type="button"
                    @click="openSearch=false"
                >
                    <i class="p-2 material-icons text-2xl text-white">close</i>
                </button>
                <form
                    v-if="config.public.googleSearch !== ''"
                    class="mt-10 sm:mt-20 flex flex-col sm:flex-row items-center justify-center"
                    action="/search"
                    @submit.prevent
                >
                    <label
                        for="input-search-keyword"
                        class="flex items-center mr-0 sm:mr-4 w-full sm:w-auto"
                    >
                        <i class="pr-2 py-2 material-icons text-2xl">search</i>
                        サイト内検索
                    </label>
                    <div class="rounded flex flex-grow items-center border border-stone-800 w-full sm:w-auto">
                        <input
                            id="input-search-keyword"
                            v-model="searchKeyword"
                            type="text"
                            placeholder="キーワードを入力"
                            class="border-none rounded-l flex-grow w-40"
                            @keydown="keydownSearch"
                        >
                        <button
                            class="whitespace-nowrap bg-stone-600 text-white py-2 px-6 box-border border-2 border-stone-600 focus:border-2 focus:border-orange-400 w-max hover:opacity-60"
                            @click="searchGoogle"
                        >
                            検索
                        </button>
                    </div>
                </form>
                <div class="mt-6 mb-20">
                    <h2
                        class="flex items-center w-full"
                    >
                        <i class="pr-2 py-2 material-icons text-2xl">sell</i>
                        タグ
                    </h2>
                    <ul class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <li
                            v-for="(tag, index) in tagList"
                            :key="index"
                            class="my-2"
                        >
                            <AtomTag
                                :id="tag.id"
                                :label="tag.label"
                                :icon="tag.icon_path"
                                @click="openSearch=false"
                            />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </header>
</template>

<style>
.logo {
    color: #000;
    stroke: #000;
    fill: #000;
}
</style>
