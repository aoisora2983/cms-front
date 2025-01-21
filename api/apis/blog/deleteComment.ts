import { post } from '~/api/fetch'

export type DeleteCommentRequest = {
    ids: number[]
}

export const deleteComment = async (
    request: DeleteCommentRequest,
): Promise<unknown> => {
    const res: unknown = await post('/api/manage/blog/comment/delete', request, {
        notUseFetch: true,
    })

    return res
}
