<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="outline">
        Edit Profile {{ open }}
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]">
      <DialogHeader class="p-6 pb-0">
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4 overflow-y-auto px-6">
        <div class="flex flex-col justify-between h-[300dvh]">
          <p>
            This is some placeholder content to show the scrolling behavior for modals. We use repeated line breaks to demonstrate how content can exceed minimum inner height, thereby showing inner scrolling. When content becomes longer than the predefined max-height of modal, content will be cropped and scrollable within the modal.
          </p>

          <p>This content should appear at the bottom after you scroll.</p>
        </div>
      </div>
      <DialogFooter class="p-6 pt-0">
        <Button type="submit">
          Save changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

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

interface Props {
  showRenew: boolean
}

const emit = defineEmits<{
  'update:showRenew': [value: boolean]
}>()

const props = defineProps<Props>()
const open = computed({
  get: () => props.showRenew,
  set: (value) => emit('update:showRenew', value)
})
</script>
