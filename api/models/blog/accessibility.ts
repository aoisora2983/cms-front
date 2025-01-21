export interface Accessibility {
    id: number
    title: string
    message: string
    level: number
    is_replace: number
}

export interface ReplaceWord {
    id: number
    from: string
    to: string
    level: number
}
