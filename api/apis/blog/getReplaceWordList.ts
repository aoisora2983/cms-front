import { post } from '~/api/fetch'
import type { ReplaceWord } from '~/api/models/blog/accessibility'

export type GetReplaceWordListRequest = {
    id: number
    keyword?: string
    alert_level?: number[]
}

export const getReplaceWordList = async (
    request: GetReplaceWordListRequest,
): Promise<ReplaceWord[]> => {
    const res: ReplaceWord[] = await post('/api/manage/blog/accessibility/replace/word/list',
        request,
        {
            notUseFetch: true,
            headers: {
                Authorization: 'JWT',
            },
        },
    )

    return res
}
