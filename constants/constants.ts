import type { ArticleStatus } from '~/api/models/blog/article'

export const DATE_FORMAT = 'YYYY年MM月DD日'
export const TIME_FORMAT = 'HH:mm'
export const DATETIME_FORMAT = 'YYYY/MM/DD HH:mm'

export const ARTICLE_STATUSES: ArticleStatus[] = [
    {
        id: 0,
        label: '下書き',
    },
    {
        id: 1,
        label: '公開',
    },
]

export const PORTFOLIO_STATUSES = [
    {
        id: 0,
        label: '下書き',
    },
    {
        id: 1,
        label: '公開',
    },
]

export const COMMENT_STATUSES = [
    {
        id: 0,
        label: '承認待',
    },
    {
        id: 1,
        label: '公開中',
    },
]

export const CORRECT_NO_CHECK = 0
export const CORRECT_NG = 1
export const CORRECT_WARNING = 2

export const CHECK_LEVELS = [
    {
        id: CORRECT_NO_CHECK,
        label: 'チェック無',
    },
    {
        id: CORRECT_WARNING,
        label: '警告',
    },
    {
        id: CORRECT_NG,
        label: '禁止',
    },
]
