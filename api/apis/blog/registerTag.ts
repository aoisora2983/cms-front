import { post } from '~/api/fetch'

export type RegisterTagRequest = {
    id: number | null
    name: string
    filename: string
}

export const registerTag = async (
    request: RegisterTagRequest,
): Promise<unknown> => {
    const res: unknown = await post('/api/manage/blog/tag/register', request, {
        notUseFetch: true,
        headers: {
            Authorization: 'JWT',
        },
    })

    return res
}
