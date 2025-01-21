import { post } from '~/api/fetch'

export type DeleteUserRequest = {
    id: number
}

export const deleteUser = async (
    request: DeleteUserRequest,
): Promise<unknown> => {
    const res: unknown = await post('/api/manage/user/delete', request, {
        notUseFetch: true,
    })

    return res
}
