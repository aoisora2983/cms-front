import { post } from '~/api/fetch'
import type { Opinion } from '~/api/models/opinion/opinion'

export type GetOpinionListRequest = {
    name: string
}

export const getOpinionList = async (
    request: GetOpinionListRequest,
): Promise<Opinion[]> => {
    const res: Opinion[] = await post('/api/manage/opinion/get/list', request, {
        headers: {
            Authorization: 'JWT',
        },
    })

    return res
}
