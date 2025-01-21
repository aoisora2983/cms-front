import type { Comment } from './comment'

export type OpenArticles = {
    articles: Array<Article>
    total: number
}

export type Articles = {
    articles: Array<Array<Article>>
    total: number
}

export type EditArticle = {
    tags: Array<Tag>
    content: Content
}

export type Article = {
    tags: Array<Tag>
    content: Content
    meta: Meta
    comments: Array<Comment>
}

export type Tag = {
    id: number
    label: string
    icon_path: string
    status: number | undefined
}

export type Meta = {
    article_good: string
}

export type ArticleStatus = {
    id: number
    label: string
}

export type Content = {
    id: number | null
    id_branch: number | null
    id_user: number | null
    title: string
    user_name: string
    user_description: string
    user_icon_path: string
    content: string
    published_start_time: string
    published_end_time: string
    published_update_time: string
    status: ArticleStatus
    thumbnail: string
    description: string
}
