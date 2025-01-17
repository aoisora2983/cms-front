import { post } from '~/api/fetch'

export type OpenArticleListRequest = {
    keyword: string | null
    categories: Array<number> | null
    tags: Array<number> | null
    limit: number | null
    page: number | null
}

export const getOpenArticleList = async (
    request: OpenArticleListRequest,
): Promise<{ message: string }> => {
    const res: { message: string } = await post('/api/view/article/list', {
        params: request,
    })

    return res;
}
