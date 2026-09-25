<script setup lang="ts">
import defaultImage from '@/assets/img/no_image.jpg'
import type { UserLink } from '~/api/models/user/user'

interface Props {
    thumbnail?: string
    author?: string
    description?: string
    links?: UserLink[]
}

const props = withDefaults(defineProps<Props>(), {
    thumbnail: defaultImage,
    author: '',
    description: '',
    links: () => [],
})

const thumbnail = props.thumbnail != null ? '/uploader' + props.thumbnail : defaultImage
</script>

<template>
    <div class="bottom-0 border border-gray-300 rounded">
        <div class="mx-auto max-w-7xl px-8 md:px-16 py-6 items-center">
            <div class="flex flex-col sm:flex-row justify-center">
                <div class="w-full sm:w-auto">
                    <NuxtImg
                        class="profile-icon mx-auto"
                        :alt="'記事の作成者の' + props.author + 'のアイコン'"
                        :src="thumbnail"
                        width="176"
                        height="176"
                    />
                </div>
                <div class="pt-4 sm:pt-0 text-left space-y-2 sm:ml-4 md:ml-8 grow">
                    <div class="space-y-0.5">
                        <p class="text-center sm:text-left">
                            この記事を書いた人
                        </p>
                        <dl>
                            <dt class="text-lg text-black font-semibold">
                                {{ author }}
                            </dt>
                            <dd class="text-slate-500 font-medium whitespace-pre-wrap">
                                {{ description }}
                            </dd>
                        </dl>
                        <ul
                            v-if="links.length > 0"
                            class="flex flex-wrap justify-end gap-3 pt-2"
                        >
                            <li
                                v-for="(link, index) in links"
                                :key="index"
                            >
                                <NuxtLink
                                    :href="link.url"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="flex items-center hover:opacity-60"
                                >
                                    <NuxtImg
                                        :src="link.icon_path !== '' ? '/uploader' + link.icon_path
                                            : '/img/link_clip.svg'"
                                        :alt="link.alt"
                                        width="24"
                                        height="24"
                                    />
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
