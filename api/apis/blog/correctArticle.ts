import { post } from '~/api/fetch'
import type { CorrectStatus } from '~/api/models/blog/correct'

export type CorrectArticleRequest = {
    sentence: string
    skip_ids: number[]
}

export const correctArticle = async (
    request: CorrectArticleRequest,
): Promise<CorrectStatus> => {
    const res: CorrectStatus = await post('/api/manage/correct', request, {
        notUseFetch: true,
        headers: {
            Authorization: 'JWT',
        },
    })

    return res
}
