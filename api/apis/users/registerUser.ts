import { post } from '~/api/fetch'

export type RegisterUserRequest = {
    id: number
    group_id: number
    name: string
    password: string
    mail: string
    description: string
    filename: string
}

export const registerUser = async (
    request: RegisterUserRequest,
): Promise<unknown> => {
    const res: unknown = await post('/api/manage/user/register', request, {
        notUseFetch: true,
        headers: {
            Authorization: 'JWT',
        },
    })

    return res
}
