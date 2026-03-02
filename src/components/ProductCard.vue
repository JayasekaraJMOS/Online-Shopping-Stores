<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import type { Product } from '../types/Product'

const props = defineProps<{
  product: Product
}>()

const router = useRouter()
const cart = useCartStore()

const goToDetail = () => {
  router.push(`/product/${props.product.id}`)
}

const getRating = (rating: number | undefined) => {
  return rating ? rating.toFixed(1) : 'N/A'
}
</script>

<template>
  <div
    class="bg-white dark:bg-electro-card rounded-2xl shadow-lg dark:shadow-xl hover:shadow-electro-glow transition-all duration-300 overflow-hidden cursor-pointer group hover:-translate-y-2"
    @click="goToDetail"
  >
    <!-- Image Container -->
    <div class="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-600 dark:to-gray-700 h-56 flex items-center justify-center overflow-hidden group-hover:bg-gradient-to-br group-hover:from-indigo-50 group-hover:to-purple-50 dark:group-hover:from-indigo-700 dark:group-hover:to-purple-700 transition-all duration-300">
      <img
        :src="product.thumbnail"
        class="h-44 w-44 object-contain group-hover:scale-125 transition-transform duration-300"
        :alt="product.title"
      />
    </div>

    <div class="p-5">
      <!-- Category Badge -->
      <div class="mb-3">
        <span class="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full capitalize">{{ product.category }}</span>
      </div>

      <!-- Title -->
      <h3 class="font-black text-base md:text-lg line-clamp-2 text-gray-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{{ product.title }}</h3>
      
      <!-- Rating and Stock -->
      <div class="flex justify-between items-center mt-3 mb-3 text-sm">
        <span v-if="product.rating" class="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/50 px-3 py-1 rounded-full">
          <span class="text-lg">⭐</span>
          <span class="font-bold text-yellow-700 dark:text-yellow-400">{{ getRating(product.rating) }}</span>
        </span>
        <span v-if="product.stock" class="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-bold">
          <span class="text-lg">✓</span>
          In Stock
        </span>
        <span v-else class="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-bold">
          <span class="text-lg">✗</span>
          Out
        </span>
      </div>

      <!-- Price Section -->
      <div class="mt-4 mb-4 pb-4 border-b-2 border-gray-200 dark:border-gray-600">
        <div class="flex items-baseline gap-3">
          <p class="text-3xl font-black text-lab-state dark:text-electro-state hover:animate-flicker">${{ product.price }}</p>
          <p v-if="product.discountPercentage" class="text-lg text-red-600 dark:text-red-400 font-bold line-through opacity-70">-{{ product.discountPercentage }}%</p>
        </div>
      </div>

      <!-- Add to Cart Button -->
      <button
        class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 text-white py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-800 dark:hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 group/btn"
        @click.stop="cart.add(product)"
      >
        <span class="group-hover/btn:scale-110 inline-block transition-transform">🛒</span> Add to Cart
      </button>
    </div>
  </div>
</template>