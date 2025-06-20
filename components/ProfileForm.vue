<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ProfileResponseSchema, ProfileCreateSchema } from '~/schema/profile.scema'

const { public: { apiUrl: API_URL } } = useRuntimeConfig();

const formData = ref<ProfileCreate>({
  firstName: '',
  middleName: '',
  lastName: ''
})

const { data: profiles, execute: fetchProfile, error } = useFetch(() => `${API_URL}/api/profiles` , {
  method: 'GET',
  credentials: 'include',
  immediate: false,
  watch: false
})

const getProfile = async () => {
  await fetchProfile()

  try {
    const parsed = ProfileResponseSchema.parse(profiles.value)
    formData.value = parsed.data!
  } catch (e) {
    console.error('Failed to parse profile response:', e)
  }
}

const { data: savedProfiles, execute: saveProfile, error: saveError } = useFetch(() => `${API_URL}/api/profiles` , {
  method: 'POST',
  credentials: 'include',
  body: formData,
  immediate: false,
  watch: false
})

const save = async() => {
  await saveProfile()
  console.log(savedProfiles.value)
  console.log(saveError.value)
}
</script>


<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="outline" @click="getProfile">
        Edit Profile
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <form @submit="save">
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-2">
          <Label for="firstName" class="text-right">
            First name
          </Label>
          <Input id="firstName" v-model="formData.firstName" class="col-span-3" required/>
        </div>
        <div class="grid grid-cols-4 items-center gap-2">
          <Label for="middleName" class="text-right">
            Middle name
          </Label>
          <Input id="middleName" v-model="formData.middleName!" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-2">
          <Label for="lastName" class="text-right">
            Last name
          </Label>
          <Input id="lastName" v-model="formData.lastName" class="col-span-3" required/>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">
          Save changes
        </Button>
      </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>