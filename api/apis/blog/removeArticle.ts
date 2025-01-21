import { post } from '~/api/fetch'

export type RemoveArticleRequest = {
    id_branch: Array<string>
}

export const removeArticle = async (
    request: RemoveArticleRequest,
): Promise<unknown> => {
    const res: unknown = await post('/api/manage/blog/article/delete', request, {
        notUseFetch: true,
        headers: {
            Authorization: 'JWT',
        },
    })

    return res
}
