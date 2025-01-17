const API_URL = 'https://ao.devops.cms'

interface Options<T = object> {
    params?: T
    headers?: HeadersInit
    credentials?: Request['credentials']
    validateStatus?: (status: number) => boolean
}

function createUrl(path: string): string {
    return API_URL + path
}

// 共通
async function http<T>(path: string, config: RequestInit): Promise<T> {
    const request = new Request(createUrl(path), config)

    const res = await fetch(request)

    if (!res.ok) {
        const data = await res.json()
        let message =
            'エラーが発生しました。しばらくしてからやり直すか、システム管理者に問い合わせてください。<br>'
        message += data.message
        throw Error
    }

    // statusCodeが204のときにres.json()を実行するとエラーになるため
    if (res.status === 204) return {} as T

    return await res.json()
}

function buildCredentials(
    credentials?: Request['credentials'],
): Request['credentials'] | undefined {
    if (process.env.NODE_ENV !== 'development') {
        return undefined
    }

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

    return credentials
}

// リクエストヘッダを構築
function buildHeaders<T = HeadersInit>(headers?: T): HeadersInit {
    if (!headers) {
        return {
            'Content-Type': 'application/json',
        }
    }

    return headers
}

// クエリパラメータ付パスの構築
function buildPathWithSearchParams<T = object>(path: string, params?: T) {
    // パラメータがない場合、URLパスをそのまま返す
    if (!params || Object.keys(params).length === 0) return path

    for (const key in params) {
        if (params[key] === undefined || params[key] === null) {
            // URLSearchParamsで`key="undefined"`になるので削除する
            delete params[key]
        }
    }

    const urlSearchParams = new URLSearchParams(params)
    return `${path}?${urlSearchParams.toString()}`
}

// リクエストボディの構築
function buildRequestBody<T = object>(body: T): string | FormData | null {
    if (body instanceof FormData) return body

    // bodyがnull,undefinedの場合はnullを返して終了する
    // JSON.stringifyにnullを渡すとエラーになるため
    if (!body) return null

    return JSON.stringify(body)
}

// get
export async function get(path: string, options?: Options): Promise<any> {
    return http(
        buildPathWithSearchParams(path, options?.params ? options.params : undefined),
        {
            headers: buildHeaders(options?.headers),
            credentials: buildCredentials(options?.credentials),
        },
    )
}

// post
export async function post<T, U, V = object>(
    path: string,
    body: T,
    options?: Options<V>,
): Promise<U> {
    return http<U>(path, {
        method: 'POST',
        headers: buildHeaders(options?.headers),
        body: buildRequestBody(body),
        credentials: buildCredentials(options?.credentials),
    })
}
