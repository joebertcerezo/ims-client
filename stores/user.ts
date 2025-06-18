import { useLocalStorage } from '@vueuse/core'
import { UserLoginSchema, UserSchema } from "~/schema/user.schema";

export const useUserStore = defineStore('user', () => {
  const isValidUser = ref(false)

  const user = useLocalStorage<User>('user', {}, {
    serializer: {
      read: (value: string) => {
        try {
          return value ? JSON.parse(value) : undefined
        } catch {
          return undefined
        }
      },
      write: (value: User | undefined) => JSON.stringify(value || null)
    }
  })

  const setUser = (newUser: User) => {
    user.value = newUser
  }

  const clearUser = () => {
    user.value = undefined
  }

  const isLoggedIn = computed(() => !!user.value)

  return {
    user,
    isValidUser,

    setUser,
    clearUser,
    isLoggedIn,
  }
})
