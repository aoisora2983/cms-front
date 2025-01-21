export interface Comment {
    id: number
    id_blog_content: number
    user_name: string
    time: string
    comment: string
    status: number
    good?: number
    children: Array<Comment>
}
