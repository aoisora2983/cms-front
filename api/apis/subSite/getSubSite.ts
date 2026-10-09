import { get } from '~/api/fetch'
import type { SubSite } from '~/api/models/subSite/subSite'

export const getSubSite = async (request: {
    id?: number
    sub_dir_name?: string
}): Promise<SubSite> => {
    const res: SubSite = await get('/api/view/sub/site/', {
        params: request,
    })

    return res
}
