import { z } from "zod"
import { UserSchema } from "~/schema/user.schema";

export default defineNuxtRouteMiddleware(async (to) => {
    if (import.meta.client) return

    const { findSession, setUser } = useUserStore()
    const { isValidUser, currentUser, isLoggedIn } = storeToRefs(useUserStore())

    const currentPage = z.string().parse(to.name)
    const isExempted = ['index', 'signup'].includes(currentPage)

    const cookie = z.string().nullish().parse(useCookie('jwt').value)

    if (isExempted) {
        if (cookie) return navigateTo('/dashboard')
        return
    } else if (!cookie) {
        return navigateTo('/')
    } else {
        try {
            if (!isLoggedIn.value) {
                const { code, data } = await findSession()
                if (code === 'USER_SESSION_FOUND') {
                    const user = UserSchema.parse(data)
                    isValidUser.value = true
                    isLoggedIn.value = true
                    // currentUser.value = user
                    setUser(user)
                }
            }
        } catch (e) {
            console.log(e)
        }
    }
})
