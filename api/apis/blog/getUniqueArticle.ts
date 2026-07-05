import { get } from '~/api/fetch'
import type { Content } from '~/api/models/blog/article'

export type UniqueArticleRequest = {
    page_type: number
}

export const getUniqueArticle = async (
    request: UniqueArticleRequest,
): Promise<Content> => {
    const res: Content = await get('/api/view/article/unique/', {
        params: request,
    })

    return res
}
