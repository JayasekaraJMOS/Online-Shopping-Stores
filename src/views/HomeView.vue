<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import ProductRow from '../components/ProductRow.vue'
import NavBar from '../components/NavBar.vue'
import type { Product } from '../types/Product'

const products = ref<Product[]>([])
const searchQuery = ref<string>('')
const isLoading = ref<boolean>(true)

const fetchProducts = async (query: string = '') => {
  isLoading.value = true

  const url = query
    ? `https://dummyjson.com/products/search?q=${query}`
    : 'https://dummyjson.com/products?limit=50'

  const response = await fetch(url)
  const data: { products: Product[] } = await response.json()

  products.value = data.products
  isLoading.value = false
}

onMounted(() => fetchProducts())

watch(searchQuery, (val) => {
  if (val.length > 2 || val.length === 0) {
    fetchProducts(val)
  }
})
</script>

<template>
  <NavBar />

  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <!-- Hero Section -->
    <div class="bg-electro-bg dark:bg-electro-bg text-white py-16 px-6 shadow-xl transition-colors duration-300">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-5xl md:text-6xl font-black mb-3 leading-tight">Discover Amazing Products</h1>
        <p class="text-indigo-100 dark:text-indigo-200 text-xl md:text-2xl font-semibold">Find exactly what you're looking for with our massive collection</p>
      </div>
    </div>

    <!-- Search Section -->
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="relative group">
        <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">🔍</span>
        <input
          v-model="searchQuery"
          placeholder="Search anything you want..."
          class="w-full pl-12 pr-6 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:border-electro-accent transition-all duration-300 text-lg shadow-md dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
    </div>

    <!-- Products Section -->
    <div class="max-w-7xl mx-auto px-6 pb-12">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-32">
        <div class="animate-bounce text-7xl mb-6">🛍️</div>
        <p class="text-gray-600 dark:text-gray-300 text-2xl font-bold">Finding amazing products...</p>
        <div class="mt-6 flex gap-2">
          <div class="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style="animation-delay: 0s"></div>
          <div class="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          <div class="w-3 h-3 bg-pink-600 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
        </div>
      </div>

      <!-- Content when not loading -->
      <div v-else>
        <!-- Horizontal Rows -->
        <ProductRow title="Featured Items" :products="products.slice(0, 10)" />
        <ProductRow title="Trending" :products="products.slice(10, 20)" />

        <!-- Products Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCard
            v-for="item in products"
            :key="item.id"
            :product="item"
          />
        </div>
      </div>

      <!-- No Results -->
      <div v-if="!isLoading && products.length === 0" class="text-center py-32">
        <div class="text-8xl mb-4">🔍</div>
        <p class="text-gray-600 dark:text-gray-400 text-2xl font-bold mb-2">Nothing found</p>
        <p class="text-gray-500 dark:text-gray-500">Try a different search term</p>
      </div>
    </div>
  </div>
</template>