import type { UseFetchOptions } from '#app'

interface Options<T = object> {
    notUseFetch?: boolean
    params?: T
    headers?: HeadersInit
    credentials?: Request['credentials']
    // validateStatus?: (status: number) => boolean
}

function createUrl(path: string): string {
    const config = useRuntimeConfig()
    const apiUrl = config.public.apiUrl
    return apiUrl + path
}

export class ErrorMessage {
    public name: string
    public reason: string

    constructor(messages: ErrorMessage) {
        this.name = messages?.name ?? ''
        this.reason = messages?.reason ?? ''
    }
}

export class ErrorMessages {
    public status: number
    public messages: ErrorMessage[]

    constructor(status: number, messages: ErrorMessage[]) {
        this.status = status
        this.messages = messages
    }
}

// 共通($fetch)
async function execute$fetch<T>(path: string, config: RequestInit): Promise<T> {
    const error = {
        ok: true,
        error: {},
    }
    const data = await $fetch(
        createUrl(path),
        {
            method: config.method as 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'get' | 'head' | 'patch' | 'post' | 'put' | 'delete' | 'connect' | 'options' | 'trace' | undefined,
            headers: config.headers,
            body: config.body,
            async onResponse({ response }) {
                if (!response.ok) {
                    if (Object.getOwnPropertyDescriptor(response._data, 'errorMessages')) {
                        error.ok = false
                        const errorMessage = new ErrorMessages(response.status, response._data.errorMessages)
                        error.error = errorMessage
                        throw errorMessage
                    }

                    return
                }

                // statusCodeが204のときにres.json()を実行するとエラーになるため
                if (response.status === 204) return {} as T

                return
            },
            async onResponseError({ request, response }) {
                const json = JSON.parse(response._data)
                if (Object.getOwnPropertyDescriptor(json, 'errorMessages')) {
                    error.ok = false
                    const errorMessage = new ErrorMessages(response.status, json.errorMessages)
                    error.error = errorMessage
                    throw errorMessage
                }
                console.log(request)
                console.log(response)
            },
        })

    if (!error.ok) {
        throw error.error
    }

    return data as T
}

// 共通(useFetch)
async function executeUseFetch<T>(path: string, config: UseFetchOptions<T>): Promise<T> {
    const error = {
        ok: true,
        error: {},
    }

    const { data } = await useFetch(
        createUrl(path),
        {
            method: config.method,
            headers: config.headers,
            credentials: config.credentials,
            body: config.body,
            async onResponse({ response }) {
                if (!response.ok) {
                    if (Object.getOwnPropertyDescriptor(response._data, 'errorMessages')) {
                        error.ok = false
                        const errorMessage = new ErrorMessages(response.status, response._data.errorMessages)
                        error.error = errorMessage
                        throw errorMessage
                    }

                    return
                }

                // statusCodeが204のときにres.json()を実行するとエラーになるため
                if (response.status === 204) return {} as T

                return
            },
            async onResponseError({ request, response }) {
                console.log(request)
                console.log(response)
            },
        },
    )

    if (!error.ok) {
        throw error.error
    }

    return data.value as T
}

function buildCredentials(
    credentials?: Request['credentials'],
): Request['credentials'] | undefined {
    if (process.env.NODE_ENV !== 'development') {
        return undefined
    }

    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

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
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
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
export async function get<T = object>(path: string, options?: Options): Promise<T> {
    const config = {
        headers: buildHeaders(options?.headers),
        credentials: buildCredentials(options?.credentials),
    }

    if (options?.notUseFetch) {
        return execute$fetch(
            buildPathWithSearchParams(path, options?.params ? options.params : undefined),
            config,
        )
    }
    else {
        return executeUseFetch(
            buildPathWithSearchParams(path, options?.params ? options.params : undefined),
            config,
        )
    }
}

// post
export async function post<T, U, V = object>(
    path: string,
    body: T,
    options?: Options<V>,
): Promise<U> {
    const config = {
        method: 'POST' as 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'get' | 'head' | 'patch' | 'post' | 'put' | 'delete' | 'connect' | 'options' | 'trace' | undefined,
        headers: buildHeaders(options?.headers),
        body: buildRequestBody(body),
        credentials: buildCredentials(options?.credentials),
    }

    if (options?.notUseFetch) {
        return execute$fetch<U>(path, config)
    }
    else {
        return executeUseFetch<U>(path, config)
    }
}
