import { UserSchema } from "~/schema/user.schema";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return;

  const userStore = useUserStore();
  const { user, isLoggedIn } = storeToRefs(userStore);

  const currentPage = to.path;
  const publicRoutes = ['/', '/signup'];
  const isExempted = publicRoutes.includes(currentPage);

  const isValid = await isValidUser();

  if (isValid && isExempted) {
    return navigateTo('/dashboard');
  }

  if (!isValid && !isExempted) {
    return navigateTo('/');
  }

});

async function isValidUser() {
  try {
    const config = useRuntimeConfig();
    const API_URL = config.public.apiUrl;

    const data = await $fetch(`${API_URL}/api/sessions`, {
      method: "GET",
      credentials: "include",
    });
    
    const response = UserSchema.parse(data);
    
    if (response.code === "USER_FOUND") {
      console.log(response.code)
      useUserStore().setUser(response);
      return true;
    }
    return false;
  } catch (err) {
    console.error("Authentication failed:", err);
    return false;
  }
}
