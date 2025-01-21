import { jwtDecode } from 'jwt-decode'
import { defaultSystemUser, type SystemUser } from '~/api/models/admin/SystemUser'
import { login as loginApi, type LoginRequest, logout as logoutApi } from '~/api/apis/admin/login'

export function useAuth() {
    const user: SystemUser = defaultSystemUser()

    // ログイン
    async function login(credential: LoginRequest) {
        await loginApi(credential)
    }

    // ログアウト
    async function logout() {
        await logoutApi()
        const authCookie = useCookie('authToken')
        authCookie.value = null
    }

    // ログインしているか
    function authenticated() {
        const token = useCookie('authToken')
        if (token && token.value) {
            try {
                const decodedToken = jwtDecode(token.value)
                const currentTime = Date.now() / 1000

                if (decodedToken.exp && decodedToken.exp < currentTime) {
                    const authCookie = useCookie('authToken')
                    authCookie.value = null

                    return false
                }
            }
            catch (error) {
                console.log(error)
                const authCookie = useCookie('authToken')
                authCookie.value = null

                return false
            }
        }
        else {
            return false
        }

        return true
    }

    return {
        user,
        login,
        logout,
        authenticated,
    }
}
