export interface Accessibility {
    id: number
    title: string
    message: string
    level: number
    is_replace: number
}

export interface ReplaceWord {
    id: number
    word_from: string
    word_to: string
    level: number
}
