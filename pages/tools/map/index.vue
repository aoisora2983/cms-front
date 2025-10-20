<script setup lang="ts">
import * as d3 from 'd3'
import type { Breadcrumb } from '~/api/models/common'
import simpleMap from '~/assets/json/simplemap.json'
import type SelectPrefecture from '~/components/atoms/selectPrefecture.vue'

const title = '都道府県画像ジェネレータ'
const description = '各都道府県画像を取得することができます。日本地図全体、東北・関東等の地域毎、各都道府県など粒度を選ぶことも可能です。'

useHead({
    title: title,
    meta: [
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
    ],
})

useSeoMeta({
    description: description,
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
    label: title,
    link: '',
})

type Features = {
    type: string
    geometry: {
        type: string
        coordinates: number[][][]
    }
    properties: {
        [key: string]: string | null
    }
}

type GeoJSON = {
    type: string
    features: []
}

const json = simpleMap as GeoJSON
const width = ref(400)
const height = ref(450)

const clickedPref = ref([] as unknown[])
const clickedColor = ref('#00bcff')
const strokeWidth = ref(1)
const strokeColor = ref('#000000')
const fillColor = ref('#ffffff')

const displaySelectPrefecture = ref(false)
// 地図を生成する
const createMap = () => {
    clickedPref.value = []
    changePrefecture()
    const map = document.getElementById('map')

    if (map == null) {
        return
    }
    map.innerHTML = ''

    const svg = d3.select('#map').append('svg')
        .attr('height', height.value)
        .attr('width', width.value)

    const projection = d3.geoIdentity()
        .reflectY(true)
        .fitSize([width.value, height.value], json as d3.GeoGeometryObjects)

    const path = d3.geoPath(projection)

    svg.selectAll('path')
        .data(json.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('stroke', strokeColor.value)
        .attr('stroke-width', strokeWidth.value)
        .attr('fill', fillColor.value)
        .attr('data-pref-name', function (features) {
            return features['properties']['N03_001']
        })
        .on('click', function (_, features: Features) {
            const pref = features.properties.N03_001
            const target = d3.selectAll('[data-pref-name=' + pref + ']')
            const indexOfPref = clickedPref.value.indexOf(pref)

            if (indexOfPref == -1) {
                clickedPref.value.push(pref)
                target.attr('fill', clickedColor.value)
            }
            else {
                clickedPref.value.splice(indexOfPref, 1)
                target.attr('fill', fillColor.value)
            }

            changePrefecture()
        })
}

const clickAllPref = () => {
    if (clickedPref.value.length > 0) {
        clickedPref.value = []
    }
    else {
        clickedPref.value = []
        for (const feature of json.features) {
            clickedPref.value.push(feature['properties']['N03_001'])
        }
    }
    onClickPref()
    changePrefecture()
}

const onClickPref = () => {
    const svg = d3.select('#map')
    svg.selectAll('path').attr('fill', fillColor.value)

    for (const pref of clickedPref.value) {
        const target = svg.selectAll('[data-pref-name=' + pref + ']')
        target.attr('fill', clickedColor.value)
    }
}

const selectPrefecture = ref<InstanceType<typeof SelectPrefecture> | null>(null)

const changePrefecture = () => {
    if (selectPrefecture.value == null) {
        return
    }

    if (typeof selectPrefecture.value.changePrefecture == 'undefined') {
        return
    }
    selectPrefecture.value.changePrefecture(clickedPref.value)
}

onMounted(() => {
    createMap()
})

type MaxMin = {
    maxX: number
    maxY: number
    minX: number
    minY: number
}

const TO = /[MmLl][0-9.]*,[0-9.]*/g
const REMOVE = /[MmLl]/

// パスの座標の最大値・最小値を求める
const getMaxMinXY = function (d: string) {
    const result: MaxMin = {
        maxX: 0,
        maxY: 0,
        minX: 0,
        minY: 0,
    }
    const toList = d.match(TO)
    if (toList == null) {
        return result
    }

    let maxX = 0
    let maxY = 0
    let minX = 9999
    let minY = 9999

    for (let to of toList) {
        to = to.replace(REMOVE, '')
        const xyList = to.split(',')

        let x = minX
        let y = minY
        if (xyList[0] != null) {
            x = parseInt(xyList[0])
        }
        if (xyList[1] != null) {
            y = parseInt(xyList[1])
        }

        maxX = Math.max(maxX, x)
        maxY = Math.max(maxY, y)
        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
    }

    result.maxX = maxX
    result.maxY = maxY
    result.minX = minX
    result.minY = minY

    return result
}

// pathの座標を最小値をもとに調整する
const convertPathD = function (d: string, maxMin: MaxMin) {
    const toList = d.match(TO)

    if (toList == null) {
        return d
    }

    let convertD = ''
    for (let to of toList) {
        let command = 'M'
        const _command = to.match(REMOVE)
        if (_command !== null) {
            command = _command[0]
        }

        to = to.replace(REMOVE, '')
        const xyList = to.split(',')

        let x = 0
        let y = 0
        if (xyList[0] != null) {
            x = parseFloat(xyList[0]) - maxMin.minX
        }
        if (xyList[1] != null) {
            y = parseFloat(xyList[1]) - maxMin.minY
        }

        convertD += command + x + ',' + y
    }

    return convertD + 'Z'
}

// svg画像ダウンロード
const onClickDownload = function () {
    const svg = document.createElement('svg')
    svg.setAttribute('id', 'downloadSvg')
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

    let ds = ''
    for (const pref of clickedPref.value) {
        const target = document.querySelectorAll('[data-pref-name=' + pref + ']')
        for (const path of target) {
            ds += path.getAttribute('d')?.replace('Z', '')
        }
    }
    const maxMin = getMaxMinXY(ds)
    svg.setAttribute('width', (maxMin.maxX - maxMin.minX + 1).toString())
    svg.setAttribute('height', (maxMin.maxY - maxMin.minY + 1).toString())

    for (const pref of clickedPref.value) {
        const target = document.querySelectorAll('[data-pref-name=' + pref + ']')
        for (const path of target) {
            const d = path.getAttribute('d')
            if (path != null && d != null) {
                const convertD = convertPathD(d, maxMin)
                const newPath = path.cloneNode() as Element
                newPath.setAttribute('d', convertD)
                svg.append(newPath)
            }
        }
    }

    const canvas = document.getElementById('canvas')
    if (canvas == null) {
        return
    }

    canvas.append(svg)
    const html = canvas.getHTML()

    const downloadArea = document.getElementById('download')
    if (downloadArea == null) {
        return
    }

    const svgBlob = new Blob([html], { type: 'image/svg+xml' })
    const svgUrl = URL.createObjectURL(svgBlob)

    const a = document.createElement('a')
    a.href = svgUrl
    a.download = '都道府県画像'

    downloadArea.append(a)
    a.click()

    downloadArea.removeChild(a)
    URL.revokeObjectURL(svgUrl)
    canvas.innerHTML = ''
}
</script>

<template>
    <main class="max-w-5xl mx-auto p-4 leading-relaxed">
        <AtomBreadcrumb :breadcrumb="breadcrumb" />
        <section>
            <div class="max-w-5xl mx-auto mt-4 sm:mt-10">
                <header class="flex items-center justify-center mb-4 sm:mb-8">
                    <i class="material-icons mr-2 text-4xl">map</i>
                    <h1 class="text-3xl font-bold text-center">
                        {{ title }}
                    </h1>
                </header>
            </div>
        </section>
        <section>
            <h2 class="text-xl border-b-2 border-gray-800 p-2 mb-2">
                カスタマイズ
            </h2>

            <div class="grid grid-cols-1">
                <dl class="flex flex-col sm:flex-row items-stretch py-1">
                    <dt
                        class="w-full sm:w-40 py-2 flex items-center justify-center text-center bg-gray-800 text-white"
                    >
                        地図サイズ
                    </dt>
                    <dd class="p-2 sm:pl-4 flex-grow bg-gray-50 grid grid-cols-1 sm:grid-cols-2">
                        <div class="flex items-center">
                            <label
                                for="input-map-width"
                                class="w-10"
                            >
                                幅
                            </label>
                            <input
                                id="input-map-width"
                                v-model="width"
                                type="number"
                                class="ml-2"
                            >
                            <p class="ml-2">
                                px
                            </p>
                        </div>
                        <div class="flex items-center sm:ml-2 mt-2 sm:mt-0">
                            <label
                                for="input-map-height"
                                class="w-10"
                            >
                                高さ
                            </label>
                            <input
                                id="input-map-height"
                                v-model="height"
                                type="number"
                                class="ml-2"
                            >
                            <p class="ml-2">
                                px
                            </p>
                        </div>
                    </dd>
                </dl>
            </div>

            <div class="grid sm:grid-cols-2">
                <dl class="flex flex-col sm:flex-row items-stretch py-1">
                    <dt
                        class="w-full sm:w-40 py-2 flex items-center justify-center text-center bg-gray-800 text-white"
                    >
                        <label
                            for="input-stroke-width"
                            class="px-2"
                        >
                            枠線の幅
                        </label>
                    </dt>
                    <dd class="p-2 sm:pl-4 flex-grow bg-gray-50">
                        <input
                            id="input-stroke-width"
                            v-model="strokeWidth"
                            type="number"
                            class="inline w-40"
                        >
                        <p class="ml-2 inline">
                            px
                        </p>
                    </dd>
                </dl>

                <dl class="flex flex-col sm:flex-row items-stretch py-1">
                    <dt
                        class="w-full sm:w-40 py-2 flex items-center justify-center text-center bg-gray-800 text-white"
                    >
                        <label
                            for="input-stroke-color"
                            class="px-2"
                        >
                            枠線の色
                        </label>
                    </dt>
                    <dd class="p-2 sm:pl-4 flex-grow bg-gray-50 flex items-center">
                        <input
                            id="input-stroke-color"
                            v-model="strokeColor"
                            type="color"
                        >
                        <input
                            v-model="strokeColor"
                            type="text"
                            class="ml-2 w-40"
                            title="枠線の色コード。"
                        >
                    </dd>
                </dl>
            </div>

            <div class="grid sm:grid-cols-2">
                <dl class="flex flex-col sm:flex-row items-stretch py-1">
                    <dt
                        class="w-full sm:w-40 py-2 flex items-center justify-center text-center bg-gray-800 text-white"
                    >
                        <label
                            for="input-fill-color"
                            class="px-2"
                        >
                            デフォルト背景色
                        </label>
                    </dt>
                    <dd class="p-2 sm:pl-4 flex-grow bg-gray-50 flex items-center">
                        <input
                            id="input-fill-color"
                            v-model="fillColor"
                            type="color"
                        >
                        <input
                            v-model="fillColor"
                            type="text"
                            class="ml-2 w-40"
                            title="非クリック時の塗りつぶしの色コード。"
                        >
                    </dd>
                </dl>

                <dl class="flex flex-col sm:flex-row items-stretch py-1">
                    <dt
                        class="w-full sm:w-40 py-2 flex items-center justify-center text-center bg-gray-800 text-white"
                    >
                        <label
                            for="input-clicked-color"
                            class="px-2"
                        >
                            クリック時背景色
                        </label>
                    </dt>
                    <dd class="p-2 sm:pl-4 flex-grow bg-gray-50 flex items-center">
                        <input
                            id="input-clicked-color"
                            v-model="clickedColor"
                            type="color"
                        >
                        <input
                            v-model="clickedColor"
                            type="text"
                            class="ml-2 w-40"
                            title="クリック時の塗りつぶしの色コード。"
                        >
                    </dd>
                </dl>
            </div>

            <div class="grid grid-cols-2 gap-4 mt-4">
                <AtomButton
                    icon="refresh"
                    label="地図を再描画する"
                    color="white"
                    bg-color="blue-700"
                    @click="createMap"
                />
                <AtomButton
                    icon="check"
                    label="都道府県全選択・全解除"
                    color="white"
                    bg-color="blue-700"
                    @click="clickAllPref"
                />
            </div>
        </section>
        <section>
            <div
                class="overflow-x-auto border m-4 flex items-center justify-center"
            >
                <div
                    id="map"
                    class="p-4"
                    style="height:400px"
                />
            </div>
            <p class="text-right">
                <NuxtLink
                    href="https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-2024.html"
                    target="_blank"
                    class="underline hover:opacity-50"
                >
                    出典：国土交通省国土数値情報ダウンロードサイト
                </NuxtLink>
                (データを加工して作成)
            </p>

            <div class="mt-4">
                <label
                    class="w-full border border-gray-600 p-2  rounded flex justify-center items-center"
                    for="checked-display-select-prefecture"
                >
                    <i class="material-icons mr-2 text-4xl">list</i>
                    一覧から選択する
                </label>
                <input
                    id="checked-display-select-prefecture"
                    v-model="displaySelectPrefecture"
                    class="hidden"
                    type="checkbox"
                >
                <div :class="displaySelectPrefecture ? '' : 'hidden'">
                    <AtomSelectPrefecture
                        ref="selectPrefecture"
                        v-model:clicked-pref="clickedPref"
                        @change="onClickPref"
                    />
                </div>
            </div>

            <div
                class="mt-10 flex items-center justify-center"
            >
                <AtomButton
                    icon="download"
                    label="保存する"
                    color="white"
                    bg-color="blue-700"
                    @click="onClickDownload"
                />
            </div>
        </section>
        <section class="mt-8 mb-20">
            <h2 class="text-xl border-b-2 border-gray-800 p-2 mb-2">
                使い方
            </h2>
            <p style="text-indent: 1rem">
                クリックした都道府県の地形画像をダウンロードできるツールです。<br>
                現在以下の機能があります。いい機能を思いついたら今後も追加予定です。<br>
                不具合報告、機能ネタをご提供いただける場合は<NuxtLink
                    class="underline hover:opacity-50"
                    href="/opinion"
                >問合せフォーム</NuxtLink>からお願いします。
            </p>
            <ul class="ml-6 mt-2 list-disc">
                <li>
                    <strong>地図サイズ</strong>を変更することで画像サイズを変更できます。
                </li>
                <li>
                    <strong>枠線の幅</strong>を変えることで、各都道府県の線の幅を変更できます。
                </li>
                <li>
                    <strong>枠線の色</strong>を変えることで、各都道府県の線の色を変更できます。
                </li>
                <li>
                    <strong>デフォルト背景色</strong>を変えることで、地図を再描画した際に都道府県の中の色を変更できます。
                </li>
                <li>
                    <strong>クリック時背景色</strong>を変えることで、地図をクリックした際に都道府県の中の色を変更できます。
                </li>
            </ul>
        </section>
        <div
            id="canvas"
            class="hidden"
        />
        <div
            id="download"
            class="hidden"
        />
    </main>
</template>
