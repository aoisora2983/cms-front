import { post } from '~/api/fetch'
import type { Accessibility } from '~/api/models/blog/accessibility'

type RegisterAccessibilityRequest = {
    id: number
    message: string
    level: number
}

export type RegisterAccessibilityListRequest = {
    accessibilityList: RegisterAccessibilityRequest[]
}

export const registerAccessibilityList = async (
    request: RegisterAccessibilityListRequest,
): Promise<Accessibility[]> => {
    const res: Accessibility[] = await post('/api/manage/blog/accessibility/register',
        request,
        {
            notUseFetch: true,
            headers: {
                Authorization: 'JWT',
            },
        },
    )

    return res
}
