<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="border-b bg-card shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-foreground">
              Inventory Management System
            </h1>
            <p class="text-muted-foreground mt-1">
              Manage your products and inventory efficiently
            </p>
          </div>
          <div class="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <User class="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="ghost" size="sm">
              <LogOut class="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent class="flex items-center p-6">
              <div class="flex items-center gap-4">
                <div class="p-2 bg-primary/10 rounded-lg">
                  <Package class="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p class="text-sm font-medium text-muted-foreground">Total Products</p>
                  <p class="text-2xl font-bold">{{ productsData?.data?.length || 0 }}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent class="flex items-center p-6">
              <div class="flex items-center gap-4">
                <div class="p-2 bg-green-500/10 rounded-lg">
                  <TrendingUp class="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p class="text-sm font-medium text-muted-foreground">Total Quantity</p>
                  <p class="text-2xl font-bold">{{ totalQuantity }}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent class="flex items-center p-6">
              <div class="flex items-center gap-4">
                <div class="p-2 bg-blue-500/10 rounded-lg">
                  <Layers class="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p class="text-sm font-medium text-muted-foreground">Categories</p>
                  <p class="text-2xl font-bold">{{ uniqueCategories }}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Products Table -->
        <Card>
          <CardHeader>
            <CardTitle class="text-xl">Product Inventory</CardTitle>
            <CardDescription>
              Manage your product inventory with ease
            </CardDescription>
          </CardHeader>
          <CardContent class="p-0">
            <DataTable @products-loaded="handleProductsLoaded" />
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  User, 
  LogOut, 
  Package, 
  TrendingUp, 
  Layers 
} from "lucide-vue-next";

const productsData = ref<ProductListResponse | null>(null);

const totalQuantity = computed(() => {
  if (!productsData.value?.data) return 0;
  return productsData.value.data.reduce((sum, product) => sum + product.quantity, 0);
});

const uniqueCategories = computed(() => {
  if (!productsData.value?.data) return 0;
  const categories = new Set(productsData.value.data.map(product => product.category.name));
  return categories.size;
});

const handleProductsLoaded = (data: ProductListResponse) => {
  productsData.value = data;
};

useHead({
  title: 'Dashboard - Inventory Management System'
});
</script>
