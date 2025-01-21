import { post } from '~/api/fetch'

export type RegisterArticleRequest = {
    id: number | null
    id_branch: number | null
    id_user: number
    title: string
    content: string
    tags: Array<number>
    status: number
    published_start_date: string
    published_end_date: string | null
    description: string
    thumbnail: string
}

export const registerArticle = async (
    request: RegisterArticleRequest,
): Promise<unknown> => {
    const res: unknown = await post('/api/manage/blog/article/register', request, {
        notUseFetch: true,
        headers: {
            Authorization: 'JWT',
        },
    })

    return res
}
