import { useLocalStorage } from '@vueuse/core'

export const useUserStore = defineStore('user', () => {
  const user = useLocalStorage<User | undefined>('user', undefined, {
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
    setUser,
    clearUser,
    isLoggedIn
  }
})
