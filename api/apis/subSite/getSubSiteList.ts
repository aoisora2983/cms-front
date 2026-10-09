import { get } from '~/api/fetch'
import type { SubSite } from '~/api/models/subSite/subSite'

export const getSubSiteList = async (): Promise<SubSite[]> => {
    const res: SubSite[] = await get('/api/manage/sub/site/get/list',
        {
            headers: {
                Authorization: 'JWT',
            },
        },
    )

    return res
}
