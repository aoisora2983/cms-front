import { get } from '~/api/fetch'

export type RegisterCountUpCommentRequest = {
    id: number
}

export const countUpComment = async (
    request: RegisterCountUpCommentRequest,
): Promise<unknown> => {
    const res: unknown = await get('/api/view/article/comment/count/good', {
        notUseFetch: true,
        params: request,
    })

    return res
}
