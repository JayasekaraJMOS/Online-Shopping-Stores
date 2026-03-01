<script setup lang="ts">
import { ref, onMounted } from 'vue';
// Ensure this path matches your Product.ts file exactly
import type { Product } from './types/Product';
import ProductCard from './components/ProductCard.vue';

const products = ref<Product[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    // We use a search for 'lighting' to get a list (array) of multiple items
    const response = await fetch('https://dummyjson.com/products/search?q=lighting');
    const data = await response.json();
    
    // products.value must be assigned the array from data.products
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
      <p>Electronic Modules & Components</p>
    </header>

    <div v-if="isLoading" class="loading">Fetching database...</div>

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
/* Global reset to ensure dark theme */
body {
  margin: 0;
  background-color: #1a1a1a;
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

header {
  text-align: center;
  margin-bottom: 50px;
}

/* THIS SECTION FIXES THE SINGLE ITEM ISSUE */
.product-grid {
  display: grid;
  /* This creates columns that are at least 280px wide */
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  justify-items: center;
}

.loading {
  text-align: center;
  font-size: 1.5rem;
  color: #3498db;
}
</style>