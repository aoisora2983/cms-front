import { get } from '~/api/fetch'
import type { Portfolio } from '~/api/models/portfolio/portfolio'

export const getPortfolioList = async (): Promise<Portfolio[]> => {
    const res: Portfolio[] = await get('/api/manage/portfolio/get/list',
        {
            headers: {
                Authorization: 'JWT',
            },
        },
    )

    return res
}
