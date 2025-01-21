import { get } from '~/api/fetch'
import type { EditArticle } from '~/api/models/blog/article'

export type ArticleRequest = {
    id: number | null
    id_branch: number | null
}

export const getArticle = async (
    request: ArticleRequest,
): Promise<EditArticle> => {
    const res: EditArticle = await get('/api/manage/blog/article/get/',
        {
            params: request,
            headers: {
                Authorization: 'JWT',
            },
        },
    )

    return res
}
