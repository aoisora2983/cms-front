<script setup lang="ts">
import type { Breadcrumb } from "~/api/models/common";

useHead({
  title: "便利ツール一覧",
});

useSeoMeta({
  description: `パスワード作成ツールなど、便利ツール一覧です。いいネタが思いつき次第随時更新予定`,
});

const breadcrumb: Breadcrumb[] = [];
breadcrumb.push({
  label: "Home",
  link: "/",
});
breadcrumb.push({
  label: "tools",
  link: "",
});

const tools = [
  {
    url: "/tools/password",
    icon: "encrypted_add",
    title: "パスワード作成ツール",
    description: "文字数、個数、含める文字の種類など、様々な条件を指定してパスワードを複数個作成できるツールです。",
  },
];
</script>

<template>
  <main class="max-w-4xl mx-auto p-4">
    <AtomBreadcrumb :breadcrumb="breadcrumb" />
    <section id="blog-list" class="max-w-5xl mx-auto p-4 mt-10 sm:mt-32">
      <h1 class="text-4xl sm:text-4xl font-bold mb-8 text-center">便利ツール一覧</h1>
      <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <li
          v-for="(tool, index) in tools"
          :key="index"
          class="border border-gray-400 shadow rounded"
        >
          <NuxtLink :href="tool.url">
            <dl class="flex flex-col">
              <dt class="order-2 px-4 py-4 text-center">
                <h2 class="text-lg font-bold">{{ tool.title }}</h2>
              </dt>
              <dd class="order-1 flex items-center justify-center pt-8">
                <i class="material-icons mr-2 text-8xl text-blue-800">{{ tool.icon }}</i>
              </dd>
              <dd class="order-3 px-4 pb-8">
                {{ tool.description }}
              </dd>
            </dl>
          </NuxtLink>
        </li>
        <li class="flex items-end">
        良いネタを思いつき次第追加予定
        </li>
      </ul>
    </section>
  </main>
</template>
