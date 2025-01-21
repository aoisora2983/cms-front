import type { Dayjs } from 'dayjs'
import { post } from '~/api/fetch'

export type RegisterPortfolioRequest = {
    id: number
    title: string
    description: string
    thumbnail: string
    detail_url: string
    release_time: Dayjs
    status: number
    sort_order: number
}

export const registerPortfolio = async (
    request: RegisterPortfolioRequest,
): Promise<unknown> => {
    const res: unknown = await post('/api/manage/portfolio/register', request, {
        notUseFetch: true,
        headers: {
            Authorization: 'JWT',
        },
    })

    return res
}
