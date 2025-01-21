import { post } from '~/api/fetch'

export type DeletePortfolioRequest = {
    id: number
}

export const deletePortfolio = async (
    request: DeletePortfolioRequest,
): Promise<unknown> => {
    const res: unknown = await post('/api/manage/portfolio/delete', request, {
        notUseFetch: true,
    })

    return res
}
