import { get } from '~/api/fetch'
import type { Portfolio } from '~/api/models/portfolio/portfolio'

export const getOpenPortfolioList = async (): Promise<Portfolio[]> => {
    const res: Portfolio[] = await get('/api/view/portfolio/list')

    return res
}
