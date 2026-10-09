import { post } from '~/api/fetch'

export type DeleteSubSiteRequest = {
    id: number
}

export const deleteSubSite = async (
    request: DeleteSubSiteRequest,
): Promise<unknown> => {
    const res: unknown = await post('/api/manage/sub/site/delete', request, {
        notUseFetch: true,
    })

    return res
}
