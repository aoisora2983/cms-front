import { get, post } from '~/api/fetch'

export type LoginRequest = {
    mail: string
    password: string
}

export type LoginInfo = {
    mail: string
    token: string
}

export const login = async (
    request: LoginRequest,
): Promise<LoginInfo> => {
    const res: LoginInfo = await post(
        '/api/login',
        request,
        {
            notUseFetch: true,
        },
    )

    return res
}

export const logout = async (): Promise<unknown> => {
    const res: unknown = await get(
        '/api/logout',
        {
            notUseFetch: true,
        },
    )

    return res
}
