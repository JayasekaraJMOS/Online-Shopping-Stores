<script setup lang="ts">
import { ref, onMounted } from 'vue';
// Make sure this path matches your folder exactly!
import type { Product } from './types/Product';
import ProductCard from './components/ProductCard.vue';

const products = ref<Product[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    // This query pulls items that look more like electronic components/projects
    const response = await fetch('https://dummyjson.com/products/search?q=lighting');
    const data = await response.json();
    products.value = data.products;
  } catch (error) {
    console.error("Fetch failed:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="app-container">
    <header>
      <h1>🔌 ElectroHub</h1>
    </header>

    <div v-if="isLoading" class="loading">
      Scanning for modules...
    </div>

    <main v-else class="product-grid">
      <ProductCard 
        v-for="item in products" 
        :key="item.id" 
        :product="item" 
      />
    </main>
  </div>
</template>

<style>
.app-container { max-width: 1200px; margin: 0 auto; padding: 20px; color: white; }
header { text-align: center; margin-bottom: 40px; }
.loading { text-align: center; font-size: 1.5rem; margin-top: 50px; }
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
</style>