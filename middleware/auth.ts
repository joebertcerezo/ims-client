import { UserSchema } from "~/schema/user.schema";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return;
  
  const publicRoutes = ['/signup', '/'];
  const isValid = await isValidUser();

  if (!isValid && to.path == '/') {
    return navigateTo('/');
  }
  
  if (isValid) {
    if (publicRoutes.includes(to.path)) {
      return navigateTo('/dashboard');
    }
    return;
  }
  
  
});

async function isValidUser() {
  try {
    const config = useRuntimeConfig();
    const API_URL = config.public.apiUrl;
    const token = useCookie('jwt').value;
    
    if (!token) return false;
    
    const data = await $fetch(`${API_URL}/api/sessions`, {
      method: "GET",
      credentials: "include",
    });
    
    const response = UserSchema.parse(data);
    
    if (response.code === "USER_FOUND") {
      console.log(response.code)
      const userStore = useUserStore();
      userStore.setUser(response.data);
      return true;
    }
    
    return false;
  } catch (err) {
    console.error("Authentication failed:", err);
    return false;
  }
}
