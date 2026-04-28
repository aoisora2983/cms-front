import { post } from '~/api/fetch'
import type { OpenArticles } from '~/api/models/blog/article'

export type OpenArticleListRequest = {
    keyword: string | null
    tags: Array<number> | null
    exclude_page_ids: Array<number>
    limit: number | null
    page: number | null
}

export const getOpenArticleList = async (
    request: OpenArticleListRequest,
): Promise<OpenArticles> => {
    const res: OpenArticles = await post('/api/view/article/list', request)

    return res
}
