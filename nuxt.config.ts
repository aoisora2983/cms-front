// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-01-15",
  devtools: { enabled: false },
  components: [
    {
      path: "~/components",
      pathPrefix: false
    },
    {
      path: "~/components/atoms",
      prefix: "Atom"
    },
    {
      path: "~/components/molecules",
      prefix: "Molecule"
    },
    {
      path: "~/components/organisms",
      prefix: "Organism"
    },
    {
      path: "~/components/templates/",
      pathPrefix: false
    }
  ],
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss'
  ],
  css: ["@/assets/css/main.css"],
})