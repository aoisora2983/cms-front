<script setup lang="ts">
import { registerComment } from '~/api/apis/blog/registerComment'

interface Props {
    articleId?: number
    replayId?: number
}
const props = withDefaults(defineProps<Props>(), {
    articleId: 0,
    replayId: 0,
})
const loading = useLoading()
const userName = ref('')
const comment = ref('')
const isSend = ref(false)
const hasError = ref(false)
const htmlId = props.articleId + '-' + props.replayId

const onClickSubmit = async () => {
    hasError.value = false
    loading.load()
    try {
        await registerComment({
            article_id: props.articleId,
            replay_id: props.replayId,
            user_name: userName.value,
            comment: comment.value,
        })
        isSend.value = true
    }
    catch (error) {
        hasError.value = true
        console.log(error)
    }
    finally {
        loading.unload()
    }
}
</script>

<template>
    <div
        class="border-t-2 py-4"
    >
        <div v-if="!isSend">
            <div>
                <AtomInputText
                    :id="'username-' + htmlId"
                    v-model:input="userName"
                    label="UserName"
                    placeholder="No Name"
                />
            </div>

            <div class="pt-4">
                <label
                    class="text-gray-700 font-bold pl-1 mb-2"
                    :for="'comment-' + htmlId"
                >
                    Comment
                </label>
                <textarea
                    :id="'comment-' + htmlId"
                    v-model="comment"
                    placeholder="ここにコメントを入力"
                    class="border border-gray-300 rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:border-transparent h-40"
                />
            </div>
            <p
                v-if="hasError"
                class="error text-red-600 py-2"
            >
                errorMessage
            </p>
            <div class="w-full flex justify-end py-2">
                <AtomButton
                    label="投稿する"
                    color="white"
                    bg-color="black"
                    @click="onClickSubmit"
                />
            </div>
        </div>
        <div v-else>
            送信しました。
        </div>
    </div>
</template>
