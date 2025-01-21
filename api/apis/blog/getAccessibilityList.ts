import { get } from '~/api/fetch'
import type { Accessibility } from '~/api/models/blog/accessibility'

export const getAccessibilityList = async (): Promise<Accessibility[]> => {
    const res: Accessibility[] = await get('/api/manage/blog/accessibility/get/list',
        {
            headers: {
                Authorization: 'JWT',
            },
        },
    )

    return res
}
