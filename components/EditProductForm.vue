<template>
  <Dialog v-model:open="isDialogOpen">
    <DialogTrigger>
      <slot />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogDescription>
          Update the product details below. Click save when you're done.
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleEditProduct">
        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <Label for="productName">Product Name</Label>
            <Input
              id="productName"
              v-model="editForm.productName"
              type="text"
              placeholder="Enter product name"
              :disabled="currentUser.data?.role === 'staff'"
              required
            />
          </div>

          <div class="grid gap-2">
            <Label for="quantity">Quantity</Label>
            <Input
              id="quantity"
              v-model.number="editForm.quantity"
              type="number"
              placeholder="Enter quantity"
              min="0"
              required
            />
          </div>

          <div class="grid gap-2">
            <Label for="category">Category</Label>
            <Select
              v-model="editForm.category"
              :disabled="currentUser.data?.role === 'staff'"
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="category in categories"
                  :key="category"
                  :value="category"
                >
                  {{ category }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" :disabled="isSubmitting" @click="() => {
              toast(toastMsg, {
                style:{
                  background: toastStyle
                } 
              });
            }
          ">
            {{ isSubmitting ? "Updating..." : "Update Product" }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@vueuse/core";
import { ProductResponseSchema } from "~/schema/product.schema";
import { toast } from 'vue-sonner'

interface Props {
  productId?: string;
  productName?: string;
  quantity?: number;
  category?: string | undefined | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  productUpdated: [];
}>();

const { public: { apiUrl: API_URL } } = useRuntimeConfig();

const { currentUser } = storeToRefs(useUserStore())

const isDialogOpen = ref(false);
const isSubmitting = ref(false);
const toastMsg = ref('')
const toastStyle = ref('')

const editForm = ref({
  id: "",
  productName: "",
  quantity: 0,
  category: "",
});

const categories = [
  "Groceries",
  "Body Essentials",
  "Baby & Child Essentials",
  "Personal Care",
  "Kitchen Essentials",
  "Cleaning Supplies",
  "Laundry",
  "Bathroom Supplies",
];

watch(
  () => props,
  (newProps) => {
    if (newProps.productId) {
      editForm.value = {
        id: newProps.productId,
        productName: newProps.productName || "",
        quantity: newProps.quantity || 0,
        category: newProps.category || "",
      };
    }
  },
  { immediate: true, deep: true }
);

const handleEditProduct = async () => {
  try {
    isSubmitting.value = true;

    const payload = {
      id: editForm.value.id,
      productName: editForm.value.productName,
      quantity: editForm.value.quantity,
      category: editForm.value.category,
    };

    const data = await $fetch(`${API_URL}/api/products`, {
      method: "PUT",
      body: payload,
      credentials: "include",
    });
    const response = ProductResponseSchema.parse(data)
    if (response.code === 'PRODUCT_EDITED') {
      toastStyle.value = '#73EC8B'
      toastMsg.value = 'Profile updated successfully.'
      isDialogOpen.value = false;
      emit("productUpdated");
    }
  } catch (err) {
    toastMsg.value = 'Something went wrong. Try again later.'
    toastStyle.value = '#FF4848'
  } finally {
    isSubmitting.value = false;
  }
};
</script>
