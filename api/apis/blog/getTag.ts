import { get } from '~/api/fetch'
import type { Tag } from '~/api/models/blog/article'

export const getTag = async (request: {
    id: number
}): Promise<Tag> => {
    const res: Tag = await get('/api/view/article/tag', {
        params: request,
    })

    return res
}
