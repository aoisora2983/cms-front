export interface SystemUser {
    id: number
    groupId: number
    name: string
    email: string
    note: string
    revision: number
}

export const defaultSystemUser = (): SystemUser => ({
    id: 0,
    groupId: 0,
    name: '',
    email: '',
    note: '',
    revision: 0,
})
