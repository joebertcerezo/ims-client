<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader class="text-center">
        <CardTitle class="text-xl"> Create Account </CardTitle>
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
              <Button type="submit" class="w-full"> Signup </Button>
            </div>
            <div class="text-center text-sm">
              Already have an account?
              <NuxtLink to="/signin" class="underline underline-offset-4">
                Sign in
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
import { UserCreateSchema, UserSchema } from "~/schema/user.schema";

const config = useRuntimeConfig();
const API_URL = config.public.apiUrl;

const userForm = ref<UserCreate>({
  email: "",
  password: "",
});

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const handleSubmit = async (form: UserCreate) => {
  try {
    const payload = UserCreateSchema.parse(form);
    const { data, error } = await useFetch(`${API_URL}/api/users`, {
      method: "POST",
      body: payload,
    });
    if (!error.value) {
      const response = UserSchema.parse(data.value);
      window.alert("User Created Successfully");
    } else {
      window.alert("User Creation Failed");
    }
  } catch (err) {
    window.alert("An error occurred.");
  }
};
</script>
