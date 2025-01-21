import { post } from '~/api/fetch'

export const fileupload = async (
    request: FormData,
): Promise<{ url: string }> => {
    const res: { url: string } = await post('/api/manage/img/upload', request, {
        notUseFetch: true,
        headers: {
            Authorization: 'JWT',
            // 'Content-Type': 'multipart/form-data',
        },
    })

    return res
}
