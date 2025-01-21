<script setup lang="ts">
import { getUserList } from '~/api/apis/users/getUserList'
import noImageUrl from '@/assets/img/no_image.jpg'
import type { User } from '~/api/models/user/user'
import { deleteUser } from '~/api/apis/users/deleteUser'

definePageMeta({ layout: 'admin' })

const loading = useLoading()
const infoModal = useInfoModal()
const responsiveClass = 'flex text-center before:px-2 before:py-4  before:text-center before:font-bold before:w-2/5 before:content-[attr(data-label)] md:before:hidden md:table-cell'
const headers = {
    id: 'ID',
    name: 'Name',
    description: '概要',
    mail: 'Mail',
    action: '',
}

const users = ref(await getUserList({
    keyword: null,
}))
const showModal = ref(false)
const id = ref(0)
const groupId = ref(0)
const name = ref('')
const description = ref('')
const mail = ref('')
const iconPath = ref(noImageUrl)
const password = ref('')

const onClickEdit = (
    user: User,
) => {
    id.value = user.id
    groupId.value = user.group_id
    name.value = user.name
    description.value = user.description
    mail.value = user.mail
    iconPath.value = user.icon_path
    password.value = user.password
    showModal.value = true
}

const onClickDelete = async (
    id: number,
    name: string,
) => {
    loading.load()
    try {
        await deleteUser({
            id: id,
        })

        users.value = await getUserList({
            keyword: null,
        })

        infoModal.open(
            'ユーザー「' + name + '」を削除しました。',
            () => {},
        )
    }
    catch (error) {
        console.log(error)
    }
    finally {
        loading.unload()
    }
}

const onClickAdd = () => {
    id.value = 0
    groupId.value = 0
    name.value = ''
    description.value = ''
    mail.value = ''
    iconPath.value = noImageUrl
    password.value = ''
    showModal.value = true
}

useHead({
    title: 'ユーザー編集',
})
</script>

<template>
    <main class="max-w-7xl mx-auto w-full p-4">
        <div class="bg-white rounded p-4 my-4">
            検索枠
        </div>
        <section class="bg-white rounded p-4 my-4">
            <h1 class="mb-4 font-bold text-xl text-center">
                ユーザー一覧
            </h1>
            <table class="w-full">
                <thead class="border-b-2 border-black hidden md:table-header-group">
                    <tr class="bg-gray-200">
                        <th class="py-4" />
                        <th
                            v-for="(header, index) in headers"
                            :key="index"
                            class="py-4"
                        >
                            {{ header }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(user, index) in users"
                        :key="index"
                        :class="index % 2 == 0 ? 'bg-gray-100' : ''"
                        class="flex flex-col md:table-row hover:bg-gray-200"
                    >
                        <td
                            class="bg-black text-center md:bg-transparent w-full md:w-auto"
                        >
                            <label class="w-full p-2 md:py-4 text-center block" />
                        </td>
                        <td
                            :class="responsiveClass"
                            :data-label="headers.id"
                        >
                            <span class="px-2 py-4">
                                {{ user.id }}
                            </span>
                        </td>
                        <td
                            :class="responsiveClass"
                            :data-label="headers.name"
                        >
                            <span class="px-2 py-4">
                                {{ user.name }}
                            </span>
                        </td>
                        <td
                            :class="responsiveClass"
                            :data-label="headers.description"
                        >
                            <span class="px-2 py-4 whitespace-pre-wrap">
                                {{ user.description }}
                            </span>
                        </td>
                        <td
                            :class="responsiveClass"
                            :data-label="headers.mail"
                        >
                            <span class="px-2 py-4">
                                {{ user.mail }}
                            </span>
                        </td>
                        <td
                            :class="responsiveClass"
                            :data-label="''"
                            class="py-4"
                        >
                            <div class="order-4 flex flex-wrap gap-2 md:gap-4 flex-1">
                                <AtomButton
                                    label="修正"
                                    icon="edit"
                                    bg-color="blue-700"
                                    @click="onClickEdit(user)"
                                />
                                <AtomButton
                                    v-if="users.length > 1"
                                    label="削除"
                                    icon="delete"
                                    bg-color="red-600"
                                    @click="onClickDelete(user.id, user.name)"
                                />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="w-full mt-4">
                <AtomButton
                    label="新規追加"
                    icon="add"
                    bg-color="blue-700"
                    class="w-full"
                    @click="onClickAdd"
                />
            </div>
        </section>
        <OrganismSystemUserRegisterModal
            v-model:show="showModal"
            v-model:id="id"
            v-model:group-id="groupId"
            v-model:name="name"
            v-model:description="description"
            v-model:mail="mail"
            v-model:icon-path="iconPath"
            v-model:password="password"
        />
    </main>
</template>
