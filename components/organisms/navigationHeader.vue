<script setup lang="ts">
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
]

const route = useRoute()
const isOpen = ref(false)
const config = useRuntimeConfig()

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
</script>

<template>
    <header class="bg-white border-b-2 fixed w-full top-0 z-50 h-20">
        <div
            v-click-outside="onClickOutside"
            class="max-w-5xl pt-8 pb-4 px-4 lg:px-8 items-center justify-between mx-auto grid grid-cols-2"
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
            <nav>
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
            </nav>
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
