<template>
  <section class="border-2">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[100px]">ID</TableHead>
          <TableHead>Product Name</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead class="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody v-if="productsData">
        <TableRow v-for="product in productsData?.data" :key="product.id">
          <TableCell class="font-medium"
            >{{ product.id.slice(0, 8) }}...</TableCell
          >
          <TableCell>{{ product.productName }}</TableCell>
          <TableCell>{{ product.quantity }}</TableCell>
          <TableCell>{{ product.category.name }}</TableCell>
          <TableCell>{{ formatDate(product.createdAt) }}</TableCell>
          <TableCell class="text-right">
            <div class="flex justify-end gap-2">
              <Button variant="ghost" size="sm" @click="editItem(product.id)">
                <Edit class="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" @click="deleteItem(product.id)">
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
import { Edit, Trash2 } from "lucide-vue-next";
import { ProductListSchema } from "~/schema/product.schema";

const config = useRuntimeConfig();
const API_URL = config.public.apiUrl;

const productsData = ref<ProductListResponse>();

const productsDataGet = async () => {
  try {
    const { data, error } = await useFetch(`${API_URL}/api/products`, {
      method: "GET",
    });
    if (!error.value) {
      const response = ProductListSchema.parse(data.value);
      productsData.value = response;
    }
  } catch (err) {
    window.alert("An error occurred.");
  }
};

const productsData1 = {
  code: "PRODUCT_RETRIEVED",
  status: "OK",
  data: [
    {
      productName: "Hotdog",
      quantity: 2,
      id: "c0c51c5f-f3b0-4091-b9d9-071101a63ec4",
      category: {
        name: "Laundry",
        id: "1bbffb89-2391-49c7-b40a-f4520ca9498d",
        products: [],
        createdAt: "2025-06-16T09:11:09.1237",
      },
      createdAt: "2025-06-16T09:37:18.034174",
    },
    {
      productName: "Hotdog1",
      quantity: 2,
      id: "3a94893b-e02c-4d42-9ab5-2c11ba3a58d5",
      category: {
        name: "Laundry",
        id: "1bbffb89-2391-49c7-b40a-f4520ca9498d",
        products: [],
        createdAt: "2025-06-16T09:11:09.1237",
      },
      createdAt: "2025-06-16T09:37:35.992048",
    },
  ],
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const editItem = (id: string) => {
  console.log("Edit item:", id);
};

const deleteItem = async (id: string) => {
  if (confirm(`Are you sure you want to delete item ${id}?`)) {
    try {
      const { data, error } = await useFetch(`${API_URL}/api/products`, {
        method: "DELETE",
        query: { idProduct: id },
      });

      if (!error.value) {
        const index = productsData.value?.data.findIndex(
          (product: ProductData) => product.id === id
        );
        if (index !== -1) productsData.value?.data.splice(index!, 1);
        window.alert("Product deleted successfully");
      }
    } catch (err) {
      window.alert("An error occurred.");
    }
  }
};

onMounted(async () => {
  await productsDataGet();
});
</script>
