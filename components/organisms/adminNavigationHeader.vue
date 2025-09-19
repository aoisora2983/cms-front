<script setup lang="ts">
interface Header {
    label: string
    url: string
    icon: string
}

const headers: Header[] = [
    { label: 'Dashboard', url: '/manage/dashboard', icon: 'dashboard' },
    { label: 'Blog', url: '/manage/blog', icon: 'description' },
    { label: 'Portfolio', url: '/manage/portfolio', icon: 'work' },
    { label: 'User', url: '/manage/user', icon: 'person' },
    { label: 'Opinion', url: '/manage/opinion', icon: 'mail' },
]

const confirmModal = useConfirmModal()
const route = useRoute()
const isOpen = ref(false)
const { logout } = useAuth()
const config = useRuntimeConfig()

const isActive = (url: string) => {
    if (route.fullPath == url) {
        return true
    }

    return false
}

const onClickLogout = async () => {
    confirmModal.open(
        'ログアウトします。よろしいですか？',
        async function () {
            try {
                await logout()
                navigateTo('/manage', { external: true })
            }
            catch (error) {
                console.log(error)
            }
        },
    )
}

const { authenticated } = useAuth()

const onClickOutside = () => {
    isOpen.value = false
}
</script>

<template>
    <header class="bg-black fixed w-full top-0 z-50 h-20 text-white">
        <div
            v-click-outside="onClickOutside"
            class="max-w-5xl pt-8 pb-4 px-4 lg:px-8 items-center justify-between mx-auto grid grid-cols-2"
        >
            <div>
                <NuxtLink
                    href="/manage"
                    class="block w-min"
                >
                    <AtomLogo
                        class="logo w-16"
                        :alt="config.public.siteTitle + 'のロゴ画像'"
                    />
                </NuxtLink>
            </div>
            <nav
                v-if="authenticated()"
                class="flex justify-end items-center"
            >
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
                    <ul class="accordion-target lg:flex lg:justify-end lg:text-md">
                        <li
                            v-for="(header, index) in headers"
                            :key="index"
                        >
                            <NuxtLink
                                v-if="!isActive(header.url)"
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
                                class="px-4 py-2 opacity-60 flex justify-start items-center"
                            >
                                <i class="material-icons mr-2 text-2xl">{{ header.icon }}</i>
                                <span>
                                    {{ header.label }}
                                </span>
                            </span>
                        </li>
                        <li>
                            <a
                                class="hover:opacity-80 px-4 py-2 rounded-full flex justify-start items-center"
                                @click="onClickLogout()"
                            >
                                <i class="material-icons mr-2 text-2xl">logout</i>
                                <span>
                                    Logout
                                </span>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    </header>
</template>

<style>
#accordion-label > span {
  background-color: #fff;
}

.logo {
    color: #fff;
    stroke: #fff;
    fill: #fff;
}
</style>
