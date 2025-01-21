<script setup lang="ts">
import type { Comment } from '~/api/models/blog/comment'

interface Props {
    articleId: number
    comments: Comment[]
}

const props = withDefaults(defineProps<Props>(), {})
</script>

<template>
    <ul>
        <li
            v-for="(comment, index) in comments"
            :key="index"
            class="border-t-2 py-2"
        >
            <MoleculeComment
                :article-id="props.articleId"
                :replay-id="comment.id"
                :user-name="comment.user_name"
                :time="comment.time"
                :comment="comment.comment"
                :good="comment.good"
                :status="comment.status"
            />
            <div
                v-if="comment.children?.length > 0"
                class="pl-4 ml-4 my-2 border-l-2 border-gray-400"
            >
                <OrganismCommentList
                    :article-id="props.articleId"
                    :comments="comment.children"
                />
            </div>
        </li>
    </ul>
</template>
