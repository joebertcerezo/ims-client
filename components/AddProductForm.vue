<template>
  <Dialog v-model:open="isDialogOpen">
    <DialogTrigger
      class="flex items-center justify-center text-sm gap-1 p-2 rounded float-right hover:cursor-pointer hover:bg-slate-100"
      @click="isDialogOpen = true"
    >
      <slot />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Product</DialogTitle>
        <DialogDescription>
          Input product to the inventory. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleAddProduct">
        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <Label for="productName">Product Name</Label>
            <Input
              id="productName"
              v-model="productForm.productName"
              type="text"
              placeholder="Enter product name"
              required
            />
          </div>

          <div class="grid gap-2">
            <Label for="quantity">Quantity</Label>
            <Input
              id="quantity"
              v-model.number="productForm.quantity"
              type="number"
              placeholder="Enter quantity"
              min="0"
              required
            />
          </div>

          <div class="grid gap-2">
            <Label for="category">Category</Label>
            <Select v-model="productForm.category" required>
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
          <Button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? "Saving..." : "Save Product" }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { ProductResponseSchema } from '~/schema/product.schema';

const { public: { apiUrl: API_URL } } = useRuntimeConfig();

const emits = defineEmits<{
  (e: "productUpdated"): void;
}>();

const productForm = ref({
  productName: "",
  quantity: 0,
  category: "",
});
const isSubmitting = ref(false);
const isDialogOpen = ref(false);

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

const { data, error, execute } = useFetch(() => `${API_URL}/api/products`, {
      method: "POST",
      body: productForm,
      credentials: 'include',
      immediate: false,
      watch: false
    })
const errorMsg = ref()
const handleAddProduct = async () => {
  try {
    isSubmitting.value = true;
    await execute()

    errorMsg.value = error.value?.data.code

    // const payload = {
    //   productName: productForm.value.productName,
    //   quantity: productForm.value.quantity,
    //   category: productForm.value.category,
    // };

    // const data = await $fetch(`${API_URL}/api/products`, {
    //   method: "POST",
    //   body: payload,
    //   credentials: 'include'
    // });
    const response = ProductResponseSchema.parse(data.value)
    console.log(response.status)
    if (response.code === 'PRODUCT_SAVED') {
      window.alert("Product added successfully");

      productForm.value = {
        productName: "",
        quantity: 0,
        category: "",
      };

      isDialogOpen.value = false;

      emits("productUpdated");
    }
  } catch (err) {
    window.alert(errorMsg.value);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
