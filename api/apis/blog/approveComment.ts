import { post } from '~/api/fetch'

export type ApproveCommentRequest = {
    ids: number[]
}

export const approveComment = async (
    request: ApproveCommentRequest,
): Promise<unknown> => {
    const res: unknown = await post('/api/manage/blog/comment/approve', request, {
        notUseFetch: true,
    })

    return res
}
