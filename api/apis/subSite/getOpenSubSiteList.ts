import { get } from '~/api/fetch'
import type { SubSite } from '~/api/models/subSite/subSite'

export const getOpenSubSiteList = async (): Promise<SubSite[]> => {
    const res: SubSite[] = await get('/api/view/sub/site/get/list')

    return res
}
