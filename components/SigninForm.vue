<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader class="text-center">
        <CardTitle class="text-xl"> Login into your account </CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit(userForm)">
          <div class="grid gap-6">
            <div class="grid gap-6">
              <div class="grid gap-3">
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  v-model="userForm.email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div class="grid gap-3">
                <Label for="password">Password</Label>
                <Input
                  id="password"
                  v-model="userForm.password"
                  type="password"
                  required
                />
              </div>
              <Button type="submit" class="w-full"> Login </Button>
            </div>
            <div class="text-center text-sm">
              Don't have an account?
              <NuxtLink to="/signup" class="underline underline-offset-4">
                Sign up
              </NuxtLink>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
    <div
      class="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4"
    >
      By clicking continue, you agree to our
      <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserLoginSchema, UserSchema } from "~/schema/user.schema";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const { public: { apiUrl: API_URL } } = useRuntimeConfig();

const userForm = ref<UserLogin>({
  email: "",
  password: "",
});

const handleSubmit = async (form: UserCreate) => {
  try {
    const payload = UserLoginSchema.parse(form);
    const data = await $fetch(`${API_URL}/api/sessions`, {
      method: "POST",
      body: payload,
      credentials: "include",
    });
    const response = UserSchema.parse(data);
    if (response.code === "USER_LOGIN") {
      useUserStore().setUser(response);
      await navigateTo("/dashboard");
    }
  } catch (err) {
    window.alert("An error occurred.");
  }
};
</script>
