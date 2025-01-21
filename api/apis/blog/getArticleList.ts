import { post } from '~/api/fetch'
import type { Articles } from '~/api/models/blog/article'

export type GetArticleRequest = {
    keyword: string | null
    categories: Array<number> | null
    tags: Array<number> | null
    limit: number | null
    page: number | null
}

export const getArticleList = async (
    request: GetArticleRequest,
): Promise<Articles> => {
    const res: Articles = await post('/api/manage/blog/article/get/list',
        request,
        {
            headers: {
                Authorization: 'JWT',
            },
        },
    )

    return res
}
