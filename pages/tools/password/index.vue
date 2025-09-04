<script setup lang="ts">
import type { Breadcrumb } from '~/api/models/common'

useHead({
    title: 'パスワード作成ツール',
})

useSeoMeta({
    description: `文字数、個数、含める文字の種類など、様々な条件を指定してパスワードを複数個作成できるオンラインツールです。`,
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
    label: 'パスワード作成ツール',
    link: '',
})

const letters = 'abcdefghijklmnopqrstuvwxyz'
const numbers = '0123456789'

const passwordLengths = [8, 12]

const excludeMistakePattern = ['I', 'l', '1', 'O', 'o', '0', 'j', 'i']

const copiedOpacity = ref(0)

const initialParam = {
    custom_password_length: 16,
    password_number: 12,
    include_upper_alphabet: true,
    include_lower_alphabet: true,
    include_numeric: true,
    include_symbol: false,
    custom_symbol: '_-@',
    exclude_mistake: false,
    exclude_same_word: false,
}

const passwords = ref([''])
const checkedPasswordLength = ref(0)
const customPasswordLength = ref(initialParam.custom_password_length)
const passwordNumber = ref(initialParam.password_number)
const includeUpperAlphabet = ref(initialParam.include_upper_alphabet)
const includeLowerAlphabet = ref(initialParam.include_lower_alphabet)
const includeNumeric = ref(initialParam.include_numeric)
const includeSymbol = ref(initialParam.include_symbol)
const customSymbol = ref(initialParam.custom_symbol)
const excludeMistake = ref(initialParam.exclude_mistake)
const excludeSameWord = ref(initialParam.exclude_same_word)

const hasError = ref(false)
const errorMessage = ref('')

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

const onClickAllCopy = () => {
    copy(passwords.value.join('\n'))
}

const onClickPassword = (event: Event) => {
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
const onClickSubmit = (event: Event) => {
    event.preventDefault()

    generatePassword()
}
const onClickReset = () => {
    checkedPasswordLength.value = 0
    customPasswordLength.value = initialParam.custom_password_length
    passwordNumber.value = initialParam.password_number
    includeUpperAlphabet.value = initialParam.include_upper_alphabet
    includeLowerAlphabet.value = initialParam.include_lower_alphabet
    includeNumeric.value = initialParam.include_numeric
    includeSymbol.value = initialParam.include_symbol
    customSymbol.value = initialParam.custom_symbol
    excludeMistake.value = initialParam.exclude_mistake
    excludeSameWord.value = initialParam.exclude_same_word
}

const validationInclude = () => {
    // 含める文字が一つもチェックされてなければNG
    if (
        !includeLowerAlphabet.value
        && !includeUpperAlphabet.value
        && !includeNumeric.value
        && !includeSymbol.value
    ) {
        hasError.value = true
        errorMessage.value = '含める文字を1つ以上選択してください。'
    }

    return hasError.value
}

const validationSize = (size: number, passString: string) => {
    // 文字サイズが2文字以上でなければNG
    if (size < 2) {
        hasError.value = true
        errorMessage.value = '文字数は少なくとも2文字以上にしてください。'
    }

    // 同じ文字を含まないのに使える文字がサイズを超えていたらNG
    if (excludeSameWord.value && size >= passString.length) {
        hasError.value = true
        errorMessage.value
      = '使える文字数が指定の文字数を超えています。\n同じ文字を含められるようにする、もしくは文字数を減らすか含める文字・記号を増やしてください。'
    }

    return hasError.value
}

const generatePassword = () => {
    let password = ''
    let string = ''

    hasError.value = false
    errorMessage.value = ''

    if (validationInclude()) {
        return
    }

    if (passwordNumber.value < 1) {
        hasError.value = true
        errorMessage.value = '個数は少なくとも1以上を入力してください。'
    }

    if (includeLowerAlphabet.value) {
        string += letters
    }
    if (includeUpperAlphabet.value) {
        string += letters.toUpperCase()
    }
    if (includeNumeric.value) {
        string += numbers
    }
    if (includeSymbol.value) {
        string += customSymbol.value
    }

    if (excludeMistake.value) {
        for (const mistakeWord of excludeMistakePattern) {
            string = string.replace(mistakeWord, '')
        }
    }

    let size = passwordLengths[0]
    if (passwordLengths[checkedPasswordLength.value]) {
        size = passwordLengths[checkedPasswordLength.value]
    }
    else {
        size = customPasswordLength.value
    }

    if (validationSize(size, string)) {
        return
    }

    passwords.value = []
    let passChar = ''
    let duplicateChecker = ['']
    let passCount = 0
    for (let passCnt = 0; passCnt < passwordNumber.value; passCnt++) {
        duplicateChecker = []
        password = ''
        passCount = 0
        while (true) {
            passChar = string.charAt(Math.floor(Math.random() * string.length))
            if (excludeSameWord.value && duplicateChecker.includes(passChar)) {
                continue
            }
            duplicateChecker.push(passChar)
            password += passChar

            passCount++
            if (passCount == size) {
                break
            }
        }
        passwords.value.push(password)
    }
}

const onClickDownload = () => {
    const filename = 'passwords.csv'
    const data = passwords.value.join('\n')
    const bom = new Uint8Array([0xef, 0xbb, 0xbf])
    const blob = new Blob([bom, data], { type: 'text/csv' })
    const link = document.createElement('a')
    link.download = filename
    link.href = URL.createObjectURL(blob)
    link.click()
    URL.revokeObjectURL(link.href)
}

generatePassword()
</script>

<template>
    <main class="max-w-5xl mx-auto p-4 leading-relaxed">
        <AtomBreadcrumb :breadcrumb="breadcrumb" />
        <div class="max-w-5xl mx-auto mt-4 sm:mt-10">
            <header class="flex items-center justify-center mb-4 sm:mb-8">
                <i class="material-icons mr-2 text-4xl">encrypted_add</i>
                <h1 class="text-3xl font-bold text-center">
                    パスワード作成ツール
                </h1>
            </header>
            <section>
                <header class="flex sm:items-center justify-between p-1">
                    <div
                        class="flex sm:items-end flex-col flex-grow mr-1 sm:mr-8 sm:flex-row border-b-2 border-gray-800 p-2 mb-2"
                    >
                        <h2 class="text-xl">
                            パスワード一覧
                        </h2>
                        <p class="text-sm sm:ml-4">
                            ※クリックでコピーできます
                        </p>
                    </div>
                    <button
                        type="button"
                        class="flex items-center sm:justify-center rounded py-1 px-2 sm:py-2 sm:px-4 text-bold bg-blue-700 text-white hover:opacity-80"
                        @click="onClickAllCopy"
                    >
                        <i class="material-icons mr-1 text-2xl"> copy_all </i>
                        一括コピー
                    </button>
                </header>
                <ul
                    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-32 overflow-auto bg-gray-200 border border-gray-200 p-4"
                >
                    <li
                        v-for="(password, index) in passwords"
                        :key="index"
                    >
                        <input
                            v-model="passwords[index]"
                            class="w-full rounded"
                            title="作成したパスワード(クリックでコピーします。)"
                            type="text"
                            name="password1"
                            @click="onClickPassword"
                        >
                    </li>
                </ul>
            </section>
            <section class="mt-4">
                <h2 class="text-xl border-b-2 border-gray-800 p-2 mb-2">
                    作成条件を設定する
                </h2>
                <form class="flex flex-col">
                    <div class="flex flex-col sm:flex-row items-stretch py-1">
                        <fieldset class="contents">
                            <legend
                                class="w-full sm:w-28 py-2 flex items-center justify-center text-center bg-gray-800 text-white"
                            >
                                文字数
                            </legend>
                            <div class="flex flex-wrap flex-grow p-2 pl-4 bg-gray-200">
                                <div
                                    v-for="(passwordLength, index) in passwordLengths"
                                    :key="index"
                                    class="flex py-2 items-center pr-4"
                                >
                                    <input
                                        :id="'password-length-' + passwordLength"
                                        v-model="checkedPasswordLength"
                                        type="radio"
                                        name="password-length"
                                        :value="index"
                                    >
                                    <label
                                        :for="'password-length-' + passwordLength"
                                        class="pl-2"
                                    >
                                        {{ passwordLength }}文字
                                    </label>
                                </div>
                                <div class="py-2 flex items-center">
                                    <input
                                        id="password-length-custom"
                                        v-model="checkedPasswordLength"
                                        type="radio"
                                        name="password-length"
                                        :value="passwordLengths.length + 1"
                                    >
                                    <div class="pl-2">
                                        <input
                                            v-model="customPasswordLength"
                                            title="カスタムパスワード文字数"
                                            name="password-length-custom-input"
                                            type="number"
                                            class="w-20 rounded"
                                            @click="checkedPasswordLength = passwordLengths.length + 1"
                                        >
                                    </div>
                                    <label for="password-length-custom"> 文字 </label>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    <dl class="flex flex-col sm:flex-row items-stretch py-1">
                        <dt
                            class="w-full sm:w-28 py-2 flex items-center justify-center text-center bg-gray-800 text-white"
                        >
                            <label for="password-number"> 個数 </label>
                        </dt>
                        <dd class="p-2 sm:pl-4 flex-grow bg-gray-50">
                            <input
                                id="password-number"
                                v-model="passwordNumber"
                                name="password-number"
                                type="number"
                                class="w-28 rounded"
                            >
                            個
                        </dd>
                    </dl>

                    <div class="flex flex-col sm:flex-row items-stretch py-1">
                        <fieldset class="contents">
                            <legend
                                class="w-full sm:w-28 py-2 flex items-center justify-center text-center bg-gray-800 text-white"
                            >
                                含める文字
                            </legend>
                            <div class="flex flex-col p-2 pl-4 bg-gray-200 flex-grow">
                                <div class="py-1">
                                    <input
                                        id="include-upper-alphabet"
                                        v-model="includeUpperAlphabet"
                                        type="checkbox"
                                        name="include-option"
                                    >
                                    <label
                                        for="include-upper-alphabet"
                                        class="pl-2"
                                    > 英字(大文字) </label>
                                </div>
                                <div class="py-1">
                                    <input
                                        id="include-lower-alphabet"
                                        v-model="includeLowerAlphabet"
                                        type="checkbox"
                                        name="include-option"
                                    >
                                    <label
                                        for="include-lower-alphabet"
                                        class="pl-2"
                                    > 英字(小文字) </label>
                                </div>
                                <div class="py-1">
                                    <input
                                        id="include-numeric"
                                        v-model="includeNumeric"
                                        type="checkbox"
                                        name="include-option"
                                    >
                                    <label
                                        for="include-numeric"
                                        class="pl-2"
                                    > 数字 </label>
                                </div>
                                <div class="py-1">
                                    <input
                                        id="include-symbol"
                                        v-model="includeSymbol"
                                        type="checkbox"
                                        name="include-option"
                                    >
                                    <label
                                        for="include-symbol"
                                        class="pl-2"
                                    > 記号 </label>
                                    <input
                                        v-model="customSymbol"
                                        title="含める記号を入力できます。"
                                        name="custom-symbol-input"
                                        type="text"
                                        class="w-20 rounded"
                                    >
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    <div class="flex flex-col sm:flex-row items-stretch py-1">
                        <fieldset class="contents">
                            <legend
                                class="w-full sm:w-28 py-2 flex items-center justify-center text-center bg-gray-800 text-white"
                            >
                                その他
                            </legend>
                            <div class="flex flex-col p-2 pl-4 bg-gray-50 flex-grow">
                                <div class="py-1">
                                    <input
                                        id="exclude-mistake"
                                        v-model="excludeMistake"
                                        type="checkbox"
                                        name="exclude-option"
                                    >
                                    <label
                                        for="exclude-mistake"
                                        class="pl-2"
                                    >
                                        間違えやすい文字は含めない(I,l,1,O,o,0,j,i)
                                    </label>
                                </div>
                                <div class="py-1">
                                    <input
                                        id="exclude-same-word"
                                        v-model="excludeSameWord"
                                        type="checkbox"
                                        name="exclude-option"
                                    >
                                    <label
                                        for="exclude-same-word"
                                        class="pl-2"
                                    > 同じ文字は含めない </label>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    <div class="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            type="submit"
                            class="flex items-center justify-center rounded py-4 px-4 w-full text-bold bg-blue-700 text-white hover:opacity-80"
                            @click="onClickSubmit"
                        >
                            <i class="material-icons mr-2 text-2xl"> add </i>
                            パスワード作成
                        </button>

                        <button
                            type="button"
                            class="flex items-center justify-center rounded p-4 w-full text-bold bg-blue-700 text-white hover:opacity-80"
                            @click="onClickDownload"
                        >
                            <i class="material-icons mr-2 text-2xl"> download </i>
                            一覧ダウンロード
                        </button>

                        <button
                            type="button"
                            class="flex items-center justify-center rounded p-4 w-full text-bold bg-red-800 text-white hover:opacity-80"
                            @click="onClickReset"
                        >
                            <i class="material-icons mr-2 text-2xl"> undo </i>
                            リセット
                        </button>
                    </div>

                    <div
                        v-if="hasError"
                        class="flex justify-center mt-4"
                    >
                        <p
                            class="w-max text-red-600 py-2 px-4 rounded bg-red-200 flex items-center whitespace-pre-wrap"
                        >
                            <i class="material-icons mr-4 text-xl">error</i>{{ errorMessage }}
                        </p>
                    </div>
                </form>
            </section>
            <section class="mt-8 mb-20">
                <h2 class="text-xl border-b-2 border-gray-800 p-2 mb-2">
                    使い方
                </h2>
                <p style="text-indent: 1rem">
                    パスワードを自動作成するツールです。<br>
                    現在以下の機能があります。いい機能を思いついたら今後も追加予定です。<br>
                    不具合報告、機能ネタをご提供いただける場合は<NuxtLink
                        class="underline hover:opacity-50"
                        href="/opinion"
                    >問合せフォーム</NuxtLink>からお願いします。
                </p>
                <ul class="ml-6 list-disc">
                    <li>
                        作成されたパスワードはクリックで自動的にクリップボードにコピーされます。
                    </li>
                    <li>「一括コピー」ボタンクリックで全パスワードをコピーすることも可能です。</li>
                    <li>
                        「一覧ダウンロード」ボタンクリックでcsv形式で全パスワードをダウンロードすることができます。<br>
                        組織ごとのログインパスワードの一括作成などにご活用ください。
                    </li>
                    <li>
                        以下の項目を組み合わせて「パスワード作成」ボタンをクリックすると、条件に合わせたパスワードを自動で作成します。
                    </li>
                </ul>
                <dl>
                    <dt class="text-lg bg-gray-200 rounded py-1 ml-2 pl-4 my-2">
                        文字数
                    </dt>
                    <dd>
                        <p style="text-indent: 1rem">
                            8文字、12文字、任意の文字数を設定できます。<br>
                            設定した数がパスワードの桁数(文字数)となります。
                        </p>
                    </dd>

                    <dt class="text-lg bg-gray-200 rounded py-1 ml-2 pl-4 my-2">
                        個数
                    </dt>
                    <dd>
                        <p style="text-indent: 1rem">
                            任意のパスワードの個数を設定できます。<br>
                            設定した数分パスワードが作成されて上部に表示されます。
                        </p>
                    </dd>

                    <dt class="text-lg bg-gray-200 rounded py-1 ml-2 pl-4 my-2">
                        含める文字
                    </dt>
                    <dd>
                        <p style="text-indent: 1rem">
                            パスワードに含める文字数を設定できます。<br>
                            小文字英字(a~z)、大文字英字(A~Z)、数字(0~9)、記号(標準は「_-@」、任意で追加も可能)を設定できます。
                        </p>
                    </dd>

                    <dt class="text-lg bg-gray-200 rounded py-1 ml-2 pl-4 my-2">
                        その他
                    </dt>
                    <dd>
                        <p style="text-indent: 1rem">
                            その他の設定です。以下の2つが設定できます。
                        </p>
                        <ul class="ml-6 list-decimal">
                            <li>
                                間違えやすい文字をパスワード中に含めない設定。<br>I,l,1、O,o,0、j,iの3パターンに対応しています。
                            </li>
                            <li>
                                2回以上同じ文字を含めない設定<br>「abcdefa」のように、同じ文字(この場合a)が重複するパスワードを作成しません。
                            </li>
                        </ul>
                    </dd>
                </dl>
            </section>
        </div>

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
