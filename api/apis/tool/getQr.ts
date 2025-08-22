import { post } from '~/api/fetch'

export type QrRequest = {
    content: string
    logo_image_path: string
    halftone_image_path: string
    qr_width: number
    fg_color: string[]
    fg_angle: number
    bg_color: string
    bg_transparent: boolean
    dot_type: number
    image_extension: number
}

export const getQr = async (
    request: QrRequest,
): Promise<{ url: string }> => {
    const res: { url: string } = await post('/api/view/tool/qr', request, {
        notUseFetch: true,
    })

    return res
}
