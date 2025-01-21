export default defineNuxtPlugin((nuxt) => {
    nuxt.vueApp.directive('click-outside', (el, binding) => {
        el.clickOutsideEvent = (event: Event) => {
            if (!(el === event.target || el.contains(event.target))) {
                binding.value()
            }
        }
        document.addEventListener('click', el.clickOutsideEvent)
    })
})
