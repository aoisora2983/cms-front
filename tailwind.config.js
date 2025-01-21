/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './node_modules/vue-tailwind-datepicker/**/*.js',
    ],
    theme: {
        extend: {},
    },
    plugins: [require('@tailwindcss/forms')],
}
