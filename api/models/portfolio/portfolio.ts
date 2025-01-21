import type { Dayjs } from 'dayjs'

export type Portfolio = {
    id: number
    title: string
    description: string
    thumbnail: string
    detail_url: string
    release_time: Dayjs
    status: number
    sort_order: number
}
