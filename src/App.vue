<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Product } from './types/Product';
import ProductCard from './components/ProductCard.vue';

const products = ref<Product[]>([]);
const searchQuery = ref(''); 
const isLoading = ref(true);

// 1. Fetch function that handles both general list and searches
const fetchProducts = async (query = '') => {
  isLoading.value = true;
  try {
    // If query is empty, it fetches 'lighting' products by default
    const url = query 
      ? `https://dummyjson.com/products/search?q=${query}` 
      : 'https://dummyjson.com/products/search?q=lighting';
      
    const response = await fetch(url);
    const data = await response.json();
    products.value = data.products;
  } catch (error) {
    console.error("Search failed:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => fetchProducts());

// 2. Watcher to trigger search as you type
watch(searchQuery, (newVal) => {
  if (newVal.length > 2 || newVal.length === 0) {
    fetchProducts(newVal);
  }
});
</script>

<template>
  <div class="app-container">
    <header>
      <h1>🔌 ElectroHub</h1>
      <div class="search-container">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search modules (LED, Lamp, Phone...)" 
          class="search-bar"
        />
      </div>
    </header>

    <div v-if="isLoading" class="status">Connecting to warehouse...</div>

    <main v-else-if="products.length > 0" class="product-grid">
      <ProductCard 
        v-for="item in products" 
        :key="item.id" 
        :product="item" 
      />
    </main>

    <div v-else class="status">No components found for "{{ searchQuery }}"</div>
  </div>
</template>

<style>
body {
  margin: 0;
  background-color: #121212;
  color: white;
  font-family: sans-serif;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

header { text-align: center; margin-bottom: 40px; }

/* SEARCH BAR STYLING */
.search-container { margin: 20px 0; }
.search-bar {
  width: 100%;
  max-width: 500px;
  padding: 12px 25px;
  border-radius: 30px;
  border: 1px solid #444;
  background: #222;
  color: white;
  outline: none;
}

/* THE GRID SYSTEM */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

.status { text-align: center; margin-top: 50px; color: #3498db; }
</style>