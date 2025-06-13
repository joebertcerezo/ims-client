<template>
  <div
    class="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10"
  >
    <div class="flex w-full max-w-sm flex-col gap-6">
      <a href="#" class="flex items-center gap-2 self-center font-medium">
        Inventory Management
      </a>
      <SigninForm />
    </div>
  </div>
</template>

<script lang="ts">
export const description = "A login page with a muted background color.";
</script>

<script setup lang="ts">
import SigninForm from "~/components/SigninForm.vue";
</script>
