import { get } from '~/api/fetch'

export type RegisterCountUpArticleRequest = {
    id: number
}

export const countUpArticle = async (
    request: RegisterCountUpArticleRequest,
): Promise<unknown> => {
    const res: unknown = await get('/api/view/article/count/good', {
        notUseFetch: true,
        params: request,
    })

    return res
}
