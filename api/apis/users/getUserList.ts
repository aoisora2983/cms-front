import { get } from '~/api/fetch'
import type { User } from '~/api/models/user/user'

export type GetUserRequest = {
    keyword: string | null
}

export const getUserList = async (
    request: GetUserRequest,
): Promise<User[]> => {
    const res: User[] = await get('/api/manage/user/get/list',
        {
            headers: {
                Authorization: 'JWT',
            },
            params: request,
        },
    )

    return res
}
