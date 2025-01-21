import { post } from '~/api/fetch'

export type RegisterOpinionRequest = {
    name: string
    email: string
    content: string
}

export const registerOpinion = async (
    request: RegisterOpinionRequest,
): Promise<unknown> => {
    const res: unknown = await post('/api/view/opinion/post', request, {
        notUseFetch: true,
    })

    return res
}
