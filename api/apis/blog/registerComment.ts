import { post } from '~/api/fetch'

export type RegisterCommentRequest = {
    article_id: number
    replay_id: number
    user_name: string
    comment: string
}

export const registerComment = async (
    request: RegisterCommentRequest,
): Promise<unknown> => {
    const res: unknown = await post('/api/view/article/comment', request, {
        notUseFetch: true,
    })

    return res
}
