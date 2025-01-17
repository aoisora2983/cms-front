import { post } from '~/api/fetch'

export type LoginRequest = {
    id: string
    password: string
}

export const login = async (
    request: LoginRequest,
): Promise<{ message: string }> => {
    const res: { message: string } = await post('/api/login', {
        params: request,
    })

    return res;
}
