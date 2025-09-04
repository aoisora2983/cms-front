<script setup lang="ts">
import type { Breadcrumb } from '~/api/models/common'

useHead({
    title: 'htpasswd,htaccess作成ツール',
})

useSeoMeta({
    description: `オンラインでBASIC認証用のhtpasswd,htaccessを作成するツールです`,
})

const breadcrumb: Breadcrumb[] = []
breadcrumb.push({
    label: 'Home',
    link: '/',
})
breadcrumb.push({
    label: 'tools',
    link: '/tools/',
})
breadcrumb.push({
    label: 'htpasswd,htaccess作成ツール',
    link: '',
})

const letters = 'abcdefghklmnpqrstuvwxyz'
const numbers = '23456789'
const size = 8

const htpasswdHasError = ref(false)
const htpasswdErrorMessage = ref('')

const htaccessHasError = ref(false)
const htaccessErrorMessage = ref('')

const copiedOpacity = ref(0)

const loginId = ref('')
const loginPassword = ref('')
const htpasswd = ref('')

const htpasswdPath = ref('')
const authname = ref('Enter ID and Password.')
const requireIps = ref('')
const htaccess = ref(
    'AuthType Basic\n'
    + 'AuthName "Enter ID and Password."\n'
    + 'AuthUserFile /path/here/.htpasswd\n'
    + 'require valid-user\n',
)

const generatePassword = () => {
    let password = ''
    const string = letters + letters.toUpperCase() + numbers

    let passChar = ''
    let passCount = 0
    const duplicateChecker = ['']
    while (true) {
        passChar = string.charAt(Math.floor(Math.random() * string.length))
        if (duplicateChecker.includes(passChar)) {
            continue
        }
        duplicateChecker.push(passChar)
        password += passChar

        passCount++
        if (passCount == size) {
            break
        }
    }

    loginPassword.value = password
}

async function digestMessage(message: string) {
    const msgUint8 = new TextEncoder().encode(message) // (utf-8 の) Uint8Array にエンコードする
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8) // メッセージをハッシュする

    const uint8Array = new Uint8Array(hashBuffer)
    const hash = uint8Array.reduce(
        (binaryString, uint8) => binaryString + String.fromCharCode(uint8),
        '',
    )

    htpasswd.value = loginId.value + ':{SHA}' + btoa(hash)
}

const alphaNumeric = /[a-zA-Z0-9]/
const alphaNumericSymbol = /[a-zA-Z0-9-~!+,=@]/

const generateHtpasswd = (event: Event) => {
    event.preventDefault()
    htpasswdHasError.value = false
    htpasswdErrorMessage.value = ''

    // 空文字チェック
    if (loginId.value.length < 1) {
        htpasswdHasError.value = true
        htpasswdErrorMessage.value += 'IDを少なくとも1文字以上入力してください。\n'
    }

    if (loginPassword.value.length < 1) {
        htpasswdHasError.value = true
        htpasswdErrorMessage.value += 'Passwordを少なくとも1文字以上入力してください。\n'
    }

    if (htpasswdHasError.value) {
        return
    }

    // 英数字チェック
    if (!loginId.value.match(alphaNumeric)) {
        htpasswdHasError.value = true
        htpasswdErrorMessage.value += 'IDは英数字のみ入力してください。\n'
    }

    if (!loginPassword.value.match(alphaNumeric)) {
        htpasswdHasError.value = true
        htpasswdErrorMessage.value += 'Passwordは英数字のみ入力してください。\n'
    }

    if (htpasswdHasError.value) {
        return
    }

    digestMessage(loginPassword.value)
}

const generateHtaccess = (event: Event) => {
    event.preventDefault()
    htaccessHasError.value = false
    htaccessErrorMessage.value = ''

    // 空文字チェック
    if (htpasswdPath.value.length < 1) {
        htaccessHasError.value = true
        htaccessErrorMessage.value
      += 'htpasswdを配置するパスを少なくとも1文字以上入力してください。\n'
    }

    if (authname.value.length < 1) {
        htaccessHasError.value = true
        htaccessErrorMessage.value
      += 'ダイアログに表示するメッセージを少なくとも1文字以上入力してください。\n'
    }

    if (htaccessHasError.value) {
        return
    }

    // 英数字記号チェック
    if (!htpasswdPath.value.match(alphaNumericSymbol)) {
        htaccessHasError.value = true
        htaccessErrorMessage.value
      += 'htpasswdを配置するパスは英数字記号のみ入力してください。\n'
    }

    if (!authname.value.match(alphaNumericSymbol)) {
        htaccessHasError.value = true
        htaccessErrorMessage.value
      += 'ダイアログに表示するメッセージは英数字記号のみ入力してください。\n'
    }

    if (htaccessHasError.value) {
        return
    }

    let _htaccess = ''
    const _htpasswdPath
    = (htpasswdPath.value.startsWith('/') ? '' : '/')
        + htpasswdPath.value
        + (htpasswdPath.value.endsWith('/') ? '' : '/')
    _htaccess
    = 'AuthType Basic\n'
        + 'AuthName "'
        + authname.value
        + '"\n'
        + 'AuthUserFile '
        + _htpasswdPath
        + '.htpasswd\n'
        + 'require valid-user\n'

    if (requireIps.value.length > 0) {
        const ips = requireIps.value.split('\n')
        for (const ip of ips) {
            // IP形式になってるかざっくりチェック
            if (!ip.match(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\/[0-9]{1,2}/)) {
                htaccessHasError.value = true
                htaccessErrorMessage.value = '除外するIPの形式に誤りがあります。\n'
                return
            }

            _htaccess += '\nrequire ip ' + ip
        }
    }

    htaccess.value = _htaccess
}

const fadeoutCopied = () => {
    copiedOpacity.value -= 2
    if (copiedOpacity.value > 0) {
        setTimeout(function () {
            fadeoutCopied()
        }, 10)
    }
}

const copy = (copyStr: string) => {
    navigator.clipboard.writeText(copyStr).then(() => {
        copiedOpacity.value = 100
        setTimeout(function () {
            fadeoutCopied()
        }, 1000)
    })
}

const clickResult = (event: Event) => {
    if (!event) {
        return
    }

    if (!event.target) {
        return
    }

    const target = event.target as HTMLInputElement
    target.select()
    copy(target.value)
}
</script>

<template>
    <main class="max-w-5xl mx-auto p-4 leading-relaxed">
        <AtomBreadcrumb :breadcrumb="breadcrumb" />
        <div class="max-w-5xl mx-auto mt-4 sm:mt-10">
            <header class="flex items-center justify-center mb-4 sm:mb-8">
                <h1 class="text-2xl font-bold text-center">
                    htpasswd,htaccess作成ツール
                </h1>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-2">
                <section class="md:pr-2 flex flex-col">
                    <h2 class="text-xl border-b-2 border-gray-800 p-2 mb-2">
                        htpasswd
                    </h2>
                    <form class="flex flex-col flex-grow">
                        <div class="flex-grow">
                            <dl class="flex flex-col sm:flex-row items-stretch py-1">
                                <dt
                                    class="w-full sm:w-28 py-2 flex items-center justify-center text-center bg-gray-800 text-white"
                                >
                                    <label for="input-id"> ID </label>
                                </dt>
                                <dd class="p-2 sm:pl-4 flex-grow bg-gray-200">
                                    <input
                                        id="input-id"
                                        v-model="loginId"
                                        class="w-full"
                                        placeholder="ログインIDを入力してください。"
                                        type="text"
                                    >
                                </dd>
                            </dl>
                            <dl class="flex flex-col sm:flex-row items-stretch py-1">
                                <dt
                                    class="w-full sm:w-28 py-2 flex items-center justify-center text-center bg-gray-800 text-white"
                                >
                                    <label for="input-password"> Password </label>
                                </dt>
                                <dd class="p-2 sm:pl-4 flex-grow bg-gray-50">
                                    <input
                                        id="input-password"
                                        v-model="loginPassword"
                                        class="w-full"
                                        placeholder="パスワードを入力してください。"
                                        type="text"
                                    >
                                    <br>
                                    <p>※ 暗号化方式はSHA1です。</p>
                                    <div class="flex justify-end mt-1">
                                        <button
                                            type="button"
                                            class="flex items-center justify-center rounded py-2 px-4 text-bold bg-white border border-gray-800 hover:opacity-80"
                                            @click="generatePassword"
                                        >
                                            ランダムなパスワード生成
                                        </button>
                                    </div>
                                </dd>
                            </dl>
                        </div>

                        <div
                            v-if="htpasswdHasError"
                            class="flex justify-center mt-4"
                        >
                            <p
                                class="text-red-700 py-2 px-4 rounded bg-red-200 border-2 border-red-600 flex items-center whitespace-pre-wrap mx-4"
                            >
                                <i class="material-icons mr-4 text-xl">error</i>{{ htpasswdErrorMessage }}
                            </p>
                        </div>

                        <button
                            type="submit"
                            class="flex items-center mt-2 justify-center rounded py-2 px-4 w-full text-bold bg-blue-700 text-white hover:opacity-80"
                            @click="generateHtpasswd"
                        >
                            <i class="material-icons mr-2 text-xl">keyboard_double_arrow_down</i>
                            htpasswdを作成する
                        </button>

                        <dl class="flex flex-col sm:flex-row items-stretch py-1 mt-2 md:h-52">
                            <dt
                                class="w-full sm:w-28 py-2 flex items-center justify-center text-center bg-gray-800 text-white"
                            >
                                <label for="result-htpasswd"> .htpasswd </label>
                            </dt>
                            <dd class="p-2 sm:pl-4 flex-grow bg-gray-200 flex flex-col justify-center">
                                <input
                                    id="result-htpasswd"
                                    v-model="htpasswd"
                                    class="w-full"
                                    type="text"
                                    placeholder="id:xxxx"
                                    @click="clickResult"
                                >
                                <p>※クリックでコピーされます。</p>
                            </dd>
                        </dl>
                    </form>
                </section>

                <section class="mt-8 md:mt-0 md:pl-2">
                    <h2 class="text-xl border-b-2 border-gray-800 p-2 mb-2">
                        htaccess
                    </h2>
                    <form class="flex flex-col">
                        <div class="flex-grow">
                            <dl class="flex flex-col sm:flex-row items-stretch py-1">
                                <dt
                                    class="w-full sm:w-32 p-2 flex items-center justify-center text-center bg-gray-800 text-white"
                                >
                                    <label for="input-htpasswd-path"> htpasswdを配置するパス </label>
                                </dt>
                                <dd class="p-2 sm:pl-4 flex-grow bg-gray-200">
                                    <input
                                        id="input-htpasswd-path"
                                        v-model="htpasswdPath"
                                        class="w-full"
                                        type="text"
                                        placeholder="/path/here/"
                                    >
                                </dd>
                            </dl>
                            <dl class="flex flex-col sm:flex-row items-stretch py-1">
                                <dt
                                    class="w-full sm:w-32 p-2 flex items-center justify-center text-center bg-gray-800 text-white"
                                >
                                    <label for="input-authname"> ダイアログに表示するメッセージ </label>
                                </dt>
                                <dd class="p-2 sm:pl-4 flex-grow bg-gray-50">
                                    <input
                                        id="input-authname"
                                        v-model="authname"
                                        class="w-full"
                                        type="text"
                                        placeholder="Enter ID and Password."
                                    >
                                </dd>
                            </dl>
                            <dl class="flex flex-col sm:flex-row items-stretch py-1">
                                <dt
                                    class="w-full sm:w-32 p-2 flex items-center justify-center text-center bg-gray-800 text-white"
                                >
                                    <label for="input-require-ip"> 認証を除外するIP(任意) </label>
                                </dt>
                                <dd class="p-2 sm:pl-4 flex-grow bg-gray-200">
                                    <textarea
                                        id="input-require-ip"
                                        v-model="requireIps"
                                        class="w-full"
                                        placeholder="0.0.0.0/32"
                                    />
                                </dd>
                            </dl>
                        </div>

                        <div
                            v-if="htaccessHasError"
                            class="flex justify-center mt-4"
                        >
                            <p
                                class="text-red-700 py-2 px-4 rounded bg-red-200 border-2 border-red-600 flex items-center whitespace-pre-wrap mx-4"
                            >
                                <i class="material-icons mr-4 text-xl">error</i>{{ htaccessErrorMessage }}
                            </p>
                        </div>

                        <button
                            type="submit"
                            class="flex items-center mt-2 justify-center rounded py-2 px-4 w-full text-bold bg-blue-700 text-white hover:opacity-80"
                            @click="generateHtaccess"
                        >
                            <i class="material-icons mr-2 text-xl">keyboard_double_arrow_down</i>
                            htaccessを作成する
                        </button>

                        <dl
                            class="flex flex-col sm:flex-row items-stretch py-1 mt-2 min-h-52 md:h-52"
                        >
                            <dt
                                class="w-full sm:w-32 p-2 flex items-center justify-center text-center bg-gray-800 text-white"
                            >
                                <label for="htaccess">.htaccess</label>
                            </dt>
                            <dd class="p-2 sm:pl-4 flex-grow bg-gray-50">
                                <textarea
                                    id="htaccess"
                                    v-model="htaccess"
                                    class="w-full"
                                    rows="7"
                                    @click="clickResult"
                                />
                            </dd>
                        </dl>
                    </form>
                </section>
            </div>
        </div>

        <section class="mt-8">
            <h2 class="text-2xl border-b-2 border-gray-800 p-2 mb-2">
                使い方
            </h2>
            <p style="text-indent: 1rem">
                Basic認証用のhtaccess, htpasswdを作成するツールです。
            </p>
            <p style="text-indent: 1rem">
                不具合報告をいただける場合は<NuxtLink
                    class="underline hover:opacity-50"
                    href="/opinion"
                >問合せフォーム</NuxtLink>からお願いします。
            </p>
            <h3 class="text-lg bg-gray-200 rounded py-1 ml-2 pl-4 my-2">
                htpasswd作成
            </h3>
            <p style="text-indent: 1rem">
                ID、パスワードを入力し、「htpasswdを作成する」ボタンをクリックしてください。<br>
                パスワードの暗号化方式はSHA1です。<br>
                入力結果はクリックでコピーできます。
            </p>
            <h3 class="text-lg bg-gray-200 rounded py-1 ml-2 pl-4 my-2">
                htaccess作成
            </h3>
            <p style="text-indent: 1rem">
                htpasswdを配置するパス、ダイアログに表示するメッセージを入力し、「htaccessを作成する」ボタンをクリックしてください。<br>
                任意でBasic認証の対象外とするIPも入力できます。<br>
                入力結果はクリックでコピーできます。
            </p>
        </section>

        <section class="mt-8 mb-20">
            <h2 class="text-xl border-b-2 border-gray-800 p-2 mb-2">
                注意
            </h2>
            <p style="text-indent: 1rem">
                Basic認証にはいくつかセキュリティ上のリスクがあります。リスクを認識の上ご利用ください。<br>
                ハッシュ化方式のSHA1も脆弱性が報告されています。<br>
                「見られても困らないけど、検索エンジンには載って欲しくない」「セキュリティチョット分かる人には見られてしまってもいいけど積極的に見られたくはない」程度のページの用途でご利用ください。<br>
                (身内のBBQ写真を載せたブログ記事等)<br>
            </p>
            <p style="text-indent: 1rem">
                当ツールを利用して生じた損害等の一切の責任を負いかねますのでご了承ください。
            </p>
        </section>

        <div
            :style="'opacity: ' + copiedOpacity + '%'"
            class="fixed bottom-10 left-0 right-0 flex justify-center"
        >
            <p
                class="w-max text-white py-2 px-4 rounded bg-gray-700 text-center flex items-center"
            >
                <i class="material-icons mr-2 text-xl">check</i>
                コピーしました！
            </p>
        </div>
    </main>
</template>
