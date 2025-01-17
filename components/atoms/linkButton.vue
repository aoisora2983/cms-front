<script setup lang="ts">
interface Props {
  href: string;
  label: string;
  icon: string;
}

const Props = withDefaults(defineProps<Props>(), {
  href: "",
  label: "",
});
</script>

<template>
  <a
    :href="href"
    class="text-white bg-gray-800 hover:opacity-80 focus:ring-4 focus:ring-gray-300 rounded-sm px-5 py-2.5 me-2 mb-2 flex"
  >
    <i class="material-icons mr-2">{{ icon }}</i>
    {{ label }}
  </a>
</template>
