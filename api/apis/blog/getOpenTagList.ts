import { get } from '~/api/fetch'
import type { Tag } from '~/api/models/blog/article'

export const getOpenTagList = async (request: {
    id_sub_site: number
}): Promise<Tag[]> => {
    const res: Tag[] = await get('/api/view/article/tag/list', {
        params: request,
    })

    return res
}
