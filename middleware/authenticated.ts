export default defineNuxtRouteMiddleware((to) => {
    const { authenticated } = useAuth()

    if (authenticated()) {
        if (to.path.match(/^\/manage\/*$/)) {
            return navigateTo('/manage/dashboard')
        }
    }
    else if (to.path !== '/manage') {
        return navigateTo('/manage')
    }
})
