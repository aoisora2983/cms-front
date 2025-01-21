import { get } from '~/api/fetch'
import type { Comment } from '~/api/models/blog/comment'

export const getCommentList = async (): Promise<Comment[]> => {
    const res: Comment[] = await get('/api/manage/blog/comment/get/list',
        {
            headers: {
                Authorization: 'JWT',
            },
        },
    )

    return res
}
