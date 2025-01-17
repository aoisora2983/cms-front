<script setup lang="ts">
interface Header {
  label: string;
  url: string;
  strict: boolean;
}

const headers: Header[] = [
  { label: "HOME", url: "/", strict: true },
  { label: "Blog", url: "/blog", strict: false },
  { label: "Portfolio", url: "/portfolio", strict: false },
];

const route = useRoute();
const path = route.fullPath;

const isActive = (url: string, strict: boolean) => {
  if (strict) {
    if (path == url) {
      return true;
    }
  } else {
    if (path.match(url)) {
      return true;
    }
  }

  return false;
};
</script>

<template>
  <header class="border-b-2 sticky top-0">
    <div
      class="max-w-5xl pt-8 pb-4 px-4 lg:px-8 items-center justify-between mx-auto grid grid-cols-2"
    >
      <h1>共通ヘッダー</h1>
      <nav>
        <input id="accordion" type="checkbox" class="hidden" />
        <label id="accordion-label" for="accordion">
          <span></span><span></span><span></span>
        </label>
        <ul class="accordion-target md:flex md:justify-end md:text-lg">
          <li v-for="(header, index) in headers" :key="index">
            <a
              v-if="!isActive(header.url, header.strict)"
              class="hover:opacity-80 px-4 py-2 rounded-full"
              :href="header.url"
            >
              {{ header.label }}
            </a>
            <span v-else class="px-4 py-2 opacity-60">
              {{ header.label }}
            </span>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>