import { post } from '~/api/fetch'

export type RegisterSubSiteRequest = {
    id: number
    sub_dir_name: string
    icon_text: string
    title: string
    description: string
    status: number
    sort_order: number
}

export const registerSubSite = async (
    request: RegisterSubSiteRequest,
): Promise<unknown> => {
    const res: unknown = await post('/api/manage/sub/site/register', request, {
        notUseFetch: true,
        headers: {
            Authorization: 'JWT',
        },
    })

    return res
}
