import { get } from '~/api/fetch'
import type { Tag } from '~/api/models/blog/article'

export const getTagList = async (): Promise<Tag[]> => {
    const res: Tag[] = await get('/api/view/article/tag/list')

    return res
}
