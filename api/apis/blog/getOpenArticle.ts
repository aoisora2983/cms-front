import { get } from '~/api/fetch'
import type { Article } from '~/api/models/blog/article'

export type OpenArticleRequest = {
    id: number
}

export const getOpenArticle = async (
    request: OpenArticleRequest,
): Promise<Article> => {
    const res: Article = await get('/api/view/article/', {
        params: request,
    })

    return res
}
