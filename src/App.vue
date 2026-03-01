<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Product } from './types/Product';
import ProductCard from './components/ProductCard.vue';

const products = ref<Product[]>([]);
const searchQuery = ref(''); // Holds the user's input
const isLoading = ref(true);

// Function to fetch products based on search
const fetchProducts = async (query = '') => {
  isLoading.value = true;
  try {
    // If query is empty, it shows 'lighting' by default for your electronics theme
    const endpoint = query 
      ? `https://dummyjson.com/products/search?q=${query}` 
      : 'https://dummyjson.com/products/search?q=lighting';
      
    const response = await fetch(endpoint);
    const data = await response.json();
    products.value = data.products;
  } catch (error) {
    console.error("Search failed:", error);
  } finally {
    isLoading.value = false;
  }
};

// Fetch initial data
onMounted(() => fetchProducts());

// Automatically search when the user stops typing (debouncing is better, but this is simple for now)
watch(searchQuery, (newQuery) => {
  if (newQuery.length > 2 || newQuery.length === 0) {
    fetchProducts(newQuery);
  }
});
</script>

<template>
  <div class="app-container">
    <header>
      <h1>🔌 ElectroHub</h1>
      <div class="search-wrapper">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search modules (e.g., LED, lamp, phone)..." 
          class="search-input"
        />
      </div>
    </header>

    <div v-if="isLoading" class="loading">Searching database...</div>

    <main v-else-if="products.length > 0" class="product-grid">
      <ProductCard 
        v-for="item in products" 
        :key="item.id" 
        :product="item" 
      />
    </main>
    
    <div v-else class="no-results">
      No modules found for "{{ searchQuery }}".
    </div>
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



.search-wrapper {
  margin: 20px auto;
  max-width: 500px;
}

.search-input {
  width: 100%;
  padding: 12px 20px;
  border-radius: 25px;
  border: 1px solid #444;
  background: #222;
  color: white;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #3498db;
  box-shadow: 0 0 8px rgba(52, 152, 219, 0.4);
}

.no-results {
  text-align: center;
  margin-top: 50px;
  color: #7f8c8d;
}
</style>