<script setup lang="ts">
import defaultImage from '@/assets/img/no_image.jpg'

interface Props {
    thumbnail?: string
    author?: string
    description?: string
}

const props = withDefaults(defineProps<Props>(), {
    thumbnail: defaultImage,
    author: '',
    description: '',
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
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
