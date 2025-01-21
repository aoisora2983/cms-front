export type CorrectStatus = {
    kind: number
    level: number
    message: string
    sentence: string
    replace: Array<Replace>
    replace_sentence: string
}

export type Replace = {
    from: string
    to: string
}
