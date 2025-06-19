import { useLocalStorage } from '@vueuse/core'
import { UserSchema } from "~/schema/user.schema";

export const useUserStore = defineStore('user', () => {
  const { public: { apiUrl: API_URL } } = useRuntimeConfig();

  const isValidUser = ref(false)
  const isLoggedIn = ref(false)

  const currentUser = ref<Partial<User>>()

  const setUser = (newUser: User) => {
    currentUser.value = newUser
    isValidUser.value = true
    isLoggedIn.value = true
  }

  const clearUser = () => {
    currentUser.value = undefined
    isValidUser.value = false
    isLoggedIn.value = false
  }

  async function findSession() {
    try {
       const headers: Record<string, string> = {}

      if (import.meta.server) {
        const event = await useRequestEvent()
        if (event?.node.req.headers.cookie) {
          headers.cookie = event.node.req.headers.cookie
        }
      }

      const data = await $fetch(`${API_URL}/api/sessions`, {
        method: "GET",
        credentials: "include",
        headers
      })
      const response = UserSchema.parse(data)
      if (response.code === 'USER_SESSION_FOUND') {
        setUser(response)
        return { code: response.code, data: response }
      }
      clearUser()
      return { code: response.code, data: response }
    } catch (error) {
      console.error("Error")
      clearUser()
      return { code: 'SESSION_ERROR', data: null }
    }
  }

  return {
    currentUser,
    isValidUser,
    isLoggedIn,

    setUser,
    findSession
  }
})
