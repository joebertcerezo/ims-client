<template>
  <section class="border-2 p-2">
    <Dialog v-model:open="isDialogOpen">
      <DialogTrigger
        class="flex items-center justify-center text-sm gap-1 p-2 rounded float-right hover:cursor-pointer hover:bg-slate-100"
        @click="isDialogOpen = true"
      >
        <CirclePlus class="h-4 w-4" />
        Add Product
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { Edit, Trash2, CirclePlus } from "lucide-vue-next";
import { ProductListSchema } from "~/schema/product.schema";

const config = useRuntimeConfig();
const API_URL = config.public.apiUrl;

const productsData = ref<ProductListResponse>();
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const editItem = (id: string) => {
  console.log("Edit item:", id);
};

const deleteItem = async (id: string, productName: string) => {
  if (confirm(`Are you sure you want to delete item ${productName}?`)) {
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

const handleAddProduct = async () => {
  try {
    isSubmitting.value = true;

    const payload = {
      productName: productForm.value.productName,
      quantity: productForm.value.quantity,
      category: productForm.value.category,
    };

    const { data, error } = await useFetch(`${API_URL}/api/products`, {
      method: "POST",
      body: payload,
    });

    if (!error.value) {
      window.alert("Product added successfully");

      productForm.value = {
        productName: "",
        quantity: 0,
        category: "",
      };

      isDialogOpen.value = false;

      await productsDataGet();
    }
  } catch (err) {
    window.alert("An error occurred.");
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  await productsDataGet();
});
</script>
