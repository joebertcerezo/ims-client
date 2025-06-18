<template>
  <section class="border-2 p-2">
    <AddProductForm
      @product-updated="productsDataGet()"
      v-if="userRole == 'admin'"
    >
      <CirclePlus class="h-4 w-4" />
      Add Product
    </AddProductForm>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product Name</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead class="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody v-if="productsData">
        <TableRow v-for="product in productsData?.data" :key="product.id">
          <TableCell>{{ product.productName }}</TableCell>
          <TableCell>{{ product.quantity }}</TableCell>
          <TableCell>{{ product.category.name }}</TableCell>
          <TableCell>{{ formatDate(product.createdAt) }}</TableCell>
          <TableCell class="text-right">
            <div class="flex justify-end gap-2">
              <EditProductForm
                :product-id="product.id"
                :product-name="product.productName"
                :quantity="product.quantity"
                :category="product.category.name"
                @product-updated="productsDataGet"
              >
                <Button class="hover:cursor-pointer" variant="ghost" size="sm">
                  <Edit class="h-4 w-4" />
                </Button>
              </EditProductForm>

              <Button
                :class="[
                  'hover:cursor-pointer',
                  userRole == 'staff' && 'hidden',
                ]"
                variant="ghost"
                size="sm"
                @click="deleteItem(product.id, product.productName)"
              >
                <Trash2 class="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
      <TableCaption v-else>No results found.</TableCaption>
    </Table>
  </section>
</template>

<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, CirclePlus } from "lucide-vue-next";
import { ProductListSchema } from "~/schema/product.schema";

const config = useRuntimeConfig();
const API_URL = config.public.apiUrl;

const { user } = storeToRefs(useUserStore());
const userRole = computed(() => user.value?.data?.role);

const emit = defineEmits<{
  productsLoaded: [data: ProductListResponse];
}>();

const productsData = ref<ProductListResponse>();

const productsDataGet = async () => {
  try {
    const data = await $fetch(`${API_URL}/api/products`, {
      key: "products",
      method: "GET",
      credentials: "include",
    });
    const response = ProductListSchema.parse(data);
    if (response.code === "PRODUCT_RETRIEVED") {
      productsData.value = response;
    }

    emit("productsLoaded", response);
  } catch (err) {
    console.error("An error occurred.");
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const deleteItem = async (id: string, productName: string) => {
  if (confirm(`Are you sure you want to delete item ${productName}?`)) {
    try {
      const { data, error } = await useFetch(`${API_URL}/api/products`, {
        method: "DELETE",
        query: { idProduct: id },
        credentials: "include",
      });

      if (!error.value) {
        if (productsData.value?.data) {
          const index = productsData.value?.data.findIndex(
            (product: ProductData) => product.id === id
          );
          if (index !== -1) productsData.value?.data.splice(index!, 1);
          window.alert("Product deleted successfully");
        }
      }
    } catch (err) {
      console.error("An error occurred.");
    }
  }
};

onMounted(async () => {
  await productsDataGet();
});
</script>
