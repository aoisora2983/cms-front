import { get } from '~/api/fetch'
import type { ReplaceWord } from '~/api/models/blog/accessibility'

export type GetReplaceWordListRequest = {
    id: number
}

export const getReplaceWordList = async (
    request: GetReplaceWordListRequest,
): Promise<ReplaceWord[]> => {
    const res: ReplaceWord[] = await get('/api/manage/blog/accessibility/replace/word/list',
        {
            notUseFetch: true,
            params: request,
            headers: {
                Authorization: 'JWT',
            },
        },
    )

    return res
}
