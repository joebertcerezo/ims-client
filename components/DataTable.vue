<template>
  <section class="border-2 p-2">
    <AddProductForm
      @product-updated="productsDataGet()"
      v-if="currentUser.data?.role === 'admin'"
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
                class="hover:cursor-pointer"
                variant="ghost"
                size="sm"
                v-if="currentUser.data?.role === 'admin'"
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
import { ProductResponseSchema, ProductListSchema, type ProductResponse } from "~/schema/product.schema";

const { public: { apiUrl: API_URL } } = useRuntimeConfig();

const { currentUser } = storeToRefs(useUserStore())

const emit = defineEmits<{
  productsLoaded: [data: ProductListResponse];
}>();

const productsData = ref<ProductListResponse>();

const productsDataGet = async () => {
  try {
    const data = await $fetch<ProductListResponse>(`${API_URL}/api/products`, {
      method: "GET",
      credentials: "include",
    });

    const response = ProductListSchema.safeParse(data)

    if (response.error) {
      throw Error("Test")
    }

    if (response.data.code === "PRODUCT_RETRIEVED") {
      productsData.value = response.data
    }

    emit("productsLoaded", response.data);
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
      const data = await $fetch<ProductResponse>(`${API_URL}/api/products`, {
        method: "DELETE",
        query: { idProduct: id },
        credentials: "include",
      });
      console.log(data)
      
      const response = ProductResponseSchema.safeParse(data)

      if (response.error) {
        throw Error("Test")
      }

      if (response.data.code === 'PRODUCT_DELETED') {
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
