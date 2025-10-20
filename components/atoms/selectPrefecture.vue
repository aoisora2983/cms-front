<script setup lang="ts">
interface Props {
    clickedPref: unknown[]
}

const props = withDefaults(defineProps<Props>(), {})

const emits = defineEmits(
    [
        'update:clickedPref',
    ],
)

const checkedArea = ref([])
const checkedPref = ref(props.clickedPref)

type Area = {
    name: string
    prefectures: string[]
}

const Areas: Area[] = [
    {
        name: '北海道地方',
        prefectures: ['北海道'],
    },
    {
        name: '東北地方',
        prefectures: ['青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県'],
    },
    {
        name: '関東地方',
        prefectures: ['茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県'],
    },
    {
        name: '中部地方',
        prefectures: ['山梨県', '長野県', '静岡県', '愛知県', '岐阜県', '新潟県', '富山県', '石川県', '福井県'],
    },
    {
        name: '近畿地方',
        prefectures: ['三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県'],
    },
    {
        name: '中国・四国地方',
        prefectures: ['鳥取県', '島根県', '岡山県', '広島県', '山口県', '徳島県', '香川県', '愛媛県', '高知県'],
    },
    {
        name: '九州地方',
        prefectures: ['福岡県', '佐賀県', '長崎県', '大分県', '熊本県', '宮崎県', '鹿児島県', '沖縄県'],
    },
]

function changePrefecture(_checkedPref: unknown[]) {
    checkedPref.value = _checkedPref
    checkAllAreaPrefecture()
}

defineExpose({
    changePrefecture,
})

const onClickArea = (event: Event) => {
    if (!event) {
        return
    }

    if (!event.target) {
        return
    }

    const target = event.target as HTMLInputElement
    const areaName = target.value

    const targetArea = Areas.find(item => item.name == areaName)

    if (targetArea == null) {
        return
    }

    for (const pref of targetArea.prefectures) {
        const _pref = pref as never
        const indexOfPref = checkedPref.value.indexOf(_pref)
        if (target.checked) {
            // もうない分を追加
            if (indexOfPref == -1) {
                checkedPref.value.push(_pref)
            }
        }
        else {
            // 全削除
            if (indexOfPref > -1) {
                checkedPref.value.splice(indexOfPref, 1)
            }
        }
    }

    emits('update:clickedPref', checkedPref.value)
}

const checkAllAreaPrefecture = () => {
    // 各エリアの全チェックを検知してエリアチェックを入れる
    for (const area of Areas) {
        let allChecked = true

        for (const pref of area.prefectures) {
            const indexOfPref = checkedPref.value.indexOf(pref)
            if (indexOfPref == -1) {
                allChecked = false
            }
        }

        const areaName = area.name as never
        const indexOfArea = checkedArea.value.indexOf(areaName)
        if (allChecked && indexOfArea == -1) {
            checkedArea.value.push(areaName)
        }
        else if (!allChecked && indexOfArea > -1) {
            checkedArea.value.splice(indexOfArea, 1)
        }
    }
}

const onClickPref = () => {
    emits('update:clickedPref', checkedPref.value)
    checkAllAreaPrefecture()
}
</script>

<template>
    <ul>
        <li
            v-for="(area, areaIndex) in Areas"
            :key="areaIndex"
            class="border-b first:border-t border-gray-400 box-border py-4 px-2"
        >
            <div class="flex items-center">
                <input
                    :id="'area-' + areaIndex"
                    v-model="checkedArea"
                    :value="area.name"
                    type="checkbox"
                    name="area"
                    @change="onClickArea"
                >
                <label
                    :for="'area-' + areaIndex"
                    class="ml-2 py-2"
                >
                    {{ area.name }}
                </label>
            </div>
            <ul class="flex flex-wrap">
                <li
                    v-for="(prefecture, prefIndex) in area.prefectures"
                    :key="prefIndex"
                    class="flex items-center mr-2 my-1 px-2"
                >
                    <input
                        :id="'pref-' + areaIndex + '-' + prefIndex"
                        v-model="checkedPref"
                        :value="prefecture"
                        name="prefecture"
                        type="checkbox"
                        @change="onClickPref"
                    >
                    <label
                        :for="'pref-' + areaIndex + '-' + prefIndex"
                        class="ml-2"
                    >
                        {{ prefecture }}
                    </label>
                </li>
            </ul>
        </li>
    </ul>
</template>
