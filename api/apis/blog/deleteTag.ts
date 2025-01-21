import { post } from '~/api/fetch'

export type DeleteTagRequest = {
    id: number
}

export const deleteTag = async (
    request: DeleteTagRequest,
): Promise<unknown> => {
    const res: unknown = await post('/api/manage/blog/tag/delete', request, {
        notUseFetch: true,
        headers: {
            Authorization: 'JWT',
        },
    })

    return res
}
