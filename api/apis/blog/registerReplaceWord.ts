import { post } from '~/api/fetch'

export type RegisterReplaceWordRequest = {
    id: number
    id_accessibility: number
    word_from: string
    word_to: string
    level: number
}

export const registerReplaceWord = async (
    request: RegisterReplaceWordRequest,
): Promise<unknown> => {
    const res: unknown = await post('/api/manage/blog/accessibility/replace/word/register',
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
