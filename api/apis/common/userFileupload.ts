import { post } from '~/api/fetch'

export const userFileupload = async (
    request: FormData,
): Promise<{ filename: string }> => {
    const res: { filename: string } = await post('/api/view/img/upload', request, {
        notUseFetch: true,
        headers: {},
    })

    return res
}
