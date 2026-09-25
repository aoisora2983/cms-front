export type UserLink = {
    icon_path: string
    url: string
    alt: string
}

export type User = {
    id: number
    group_id: number
    name: string
    description: string
    mail: string
    icon_path: string
    password: string
    sort_order: number
    links?: UserLink[]
}
