<script setup lang="ts">
import { ref } from 'vue'

import '~/assets/css/ckeditor.scss'
import '~/assets/css/article.scss'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import type { ArticleStatus, Tag } from '~/api/models/blog/article'
import { correctArticle } from '~/api/apis/blog/correctArticle'
import { registerArticle } from '~/api/apis/blog/registerArticle'
import { DATETIME_FORMAT, CORRECT_NG, CORRECT_WARNING } from '~/constants/constants'
import { ErrorMessages } from '~/api/fetch'
import { getArticle } from '~/api/apis/blog/getArticle'
import type { CorrectStatus } from '~/api/models/blog/correct'

definePageMeta({ layout: 'admin' })

const correctModal = useCorrectModal()
const infoModal = useInfoModal()
const messageModal = useMessageModal()
const loading = useLoading()
loading.load()

const route = useRoute()
const slug = route.params.slug
let id = null
let idBranch = null
let mode = null
if (typeof slug == 'string') {
    const params = slug.split('-')
    if (params[0] && parseInt(params[0]) != 0) {
        id = parseInt(params[0])
    }
    if (params[1] && parseInt(params[1]) != 0) {
        idBranch = parseInt(params[1])
    }
    if (params[2]) {
        mode = params[2]
    }
}

interface ArticleInput {
    title: string
    content: string
    tags: Tag[]
    publishedStartTime: Dayjs | null
    publishedEndTime: Dayjs | null
    publishedInfinity: boolean
    status: ArticleStatus | null
    description: string
    thumbnail: string
}

const showOptionModal = ref<boolean>(false)
const showTagModal = ref<boolean>(false)

const input = ref<ArticleInput>({
    title: '',
    content: '<h2>見出し</h2><p>本文</p>',
    tags: [],
    publishedStartTime: null,
    publishedEndTime: null,
    publishedInfinity: true,
    status: null,
    description: '',
    thumbnail: '',
})

if (id != null || idBranch != null) {
    try {
        const res = await getArticle({
            id: id,
            id_branch: idBranch,
        })

        input.value.title = res.content.title
        input.value.content = res.content.content
        input.value.tags = res.tags ?? []
        input.value.publishedStartTime = res.content.published_start_time
            ? dayjs(res.content.published_start_time)
            : null
        input.value.publishedEndTime = res.content.published_end_time
            ? dayjs(res.content.published_end_time)
            : null
        input.value.publishedInfinity = res.content.published_end_time ? false : true
        input.value.status = res.content.status
        input.value.description = res.content.description
        input.value.thumbnail = res.content.thumbnail
    }
    catch (error) {
        console.log(error)
    }

    if (mode == 'copy') {
        id = null
        idBranch = null
    }
}

let correctStatus: CorrectStatus | null = null
const skipLink: number[] = []
const onCorrectReplace = function () {
    loading.load()
    if (correctStatus != null) {
        input.value.content = correctStatus.replace_sentence
    }
    loading.unload()
    correctModal.close()
    correct()
}

const onCorrectIgnore = async function () {
    if (correctStatus != null) {
        skipLink.push(correctStatus.kind)
    }
    correctModal.close()
    correct()
}

const onCorrectCancel = function () {
    input.value.content = correctModal.sentence
    correctModal.close()
}

const onClick = async () => {
    skipLink.splice(0)
    correct()
}

const correct = async () => {
    loading.load()
    try {
        correctStatus = await correctArticle({
            sentence: input.value.content,
            skip_ids: skipLink,
        })

        loading.unload()
        if (correctStatus.level == CORRECT_NG) {
            correctModal.open(correctStatus, onCorrectReplace, onCorrectIgnore, onCorrectCancel)
            return false
        }
        else if (correctStatus.level == CORRECT_WARNING) {
            correctModal.open(correctStatus, onCorrectReplace, onCorrectIgnore, onCorrectCancel)
            return false
        }

        await register()
    }
    catch (error) {
        loading.unload()
        if (error instanceof ErrorMessages) {
            messageModal.setMessages(error.messages)
        }
        return false
    }
}

const register = async () => {
    loading.load()

    const _publishedStart = input.value.publishedStartTime
        ? input.value.publishedStartTime
        : dayjs().startOf('day')

    let _publishedEndTime = input.value.publishedEndTime
        ? input.value.publishedEndTime.format(DATETIME_FORMAT)
        : null
    if (input.value.publishedInfinity) {
        _publishedEndTime = null
    }
    try {
        await registerArticle({
            id: id,
            id_branch: idBranch,
            id_user: 1,
            title: input.value.title,
            content: input.value.content,
            tags: input.value.tags.map(tag => tag.id),
            status: input.value.status ? input.value.status.id : 0,
            published_start_date: _publishedStart.format(DATETIME_FORMAT),
            published_end_date: _publishedEndTime,
            description: input.value.description,
            thumbnail: input.value.thumbnail,
        })
    }
    catch (error) {
        loading.unload()
        if (error instanceof ErrorMessages) {
            messageModal.setMessages(error.messages)
        }
        return false
    }

    infoModal.open('登録に成功しました。', returnBlogList)
    loading.unload()
}

const returnBlogList = () => {
    navigateTo('/manage/blog/')
    return undefined
}

loading.unload()

useHead({
    title: 'ページ編集',
})
</script>

<template>
    <main class="bg-white w-full flex flex-col flex-grow">
        <div class="w-full max-w-4xl mx-auto p-4 relative flex flex-col flex-grow">
            <article class="break-words mt-2 mb-2 px-1 flex flex-col flex-grow">
                <h1 class="text-4xl mt-8 font-bold text-center mb-4">
                    <textarea
                        v-model="input.title"
                        placeholder="タイトル"
                        rows="1"
                        class="p-4 text-4xl text-center w-full box-border border border-transparent hover:border hover:border-gray-400 resize-none"
                    />
                </h1>
                <section
                    id="tag-list"
                    class="mb-4"
                >
                    <ul class="flex flex-wrap justify-center items-center gap-2">
                        <li
                            v-for="(item, index) in input.tags"
                            :key="index"
                        >
                            <AtomTag
                                :id="item.id"
                                :label="item.label"
                                :icon="item.icon_path"
                                :disable-link="true"
                            />
                        </li>
                        <li
                            class="rounded-full bg-gray-800 w-10 h-10 p-2 hover:opacity-60"
                            @click="showTagModal = !showTagModal"
                        >
                            <i class="material-icons mr-2 text-2xl text-white">add</i>
                        </li>
                        <OrganismTagSelectModal
                            v-model:checked-tags="input.tags"
                            v-model:show="showTagModal"
                        />
                    </ul>
                </section>
                <section
                    id="publish-info"
                    class="mb-4"
                >
                    <dl class="flex justify-end">
                        <dt>掲載日</dt>
                        <dd class="ml-2">
                            <time :datetime="'2024-01-01'">
                                2024-01-01
                            </time>
                        </dd>
                    </dl>
                    <dl class="flex justify-end">
                        <dt>更新日</dt>
                        <dd class="ml-2">
                            <time :datetime="'2024-01-01'">
                                2024-01-01
                            </time>
                        </dd>
                    </dl>
                </section>
                <section
                    id="blog-article"
                    class="box-border border border-transparent hover:border hover:border-gray-400 mb-8 flex-grow h-full"
                >
                    <ClientOnly>
                        <AtomCkeditor v-model:content="input.content" />
                    </ClientOnly>
                </section>
            </article>
        </div>
        <div class="border-b-2 sticky bottom-0 w-full bg-white z-50 border-t-2 article-option-footer">
            <div class="w-full max-w-4xl mx-auto flex justify-end items-center gap-4 p-4">
                <div>
                    <label
                        for="open-option-modal"
                        class="text-gray-900 flex justify-center items-center w-10 h-10 rounded-full hover:border hover:bg-gray-200 hover:opacity-60"
                    >
                        <i class="material-icons text-2xl">settings</i>
                    </label>
                    <input
                        id="open-option-modal"
                        v-model="showOptionModal"
                        type="checkbox"
                        class="hidden"
                    >
                    <OrganismArticleOptionModal
                        v-model:show="showOptionModal"
                        v-model:description="input.description"
                        v-model:published-start-time="input.publishedStartTime"
                        v-model:published-end-time="input.publishedEndTime"
                        v-model:published-infinity="input.publishedInfinity"
                        v-model:status="input.status"
                        v-model:thumbnail="input.thumbnail"
                    />
                </div>
                <AtomButton
                    label="保存"
                    bg-color="blue-700"
                    @click="onClick"
                />
            </div>
        </div>
    </main>
</template>

<style lang="css">
.article-option-footer {
    z-index: 999999;
}
</style>
