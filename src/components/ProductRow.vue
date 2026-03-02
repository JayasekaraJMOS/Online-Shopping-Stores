<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProductCard from './ProductCard.vue'
import type { Product } from '../types/Product'

const props = defineProps<{
  title: string
  products: Product[]
}>()

const container = ref<HTMLDivElement | null>(null)

const scrollLeft = () => {
  if (container.value) {
    container.value.scrollBy({ left: -container.value.clientWidth, behavior: 'smooth' })
  }
}

const scrollRight = () => {
  if (container.value) {
    container.value.scrollBy({ left: container.value.clientWidth, behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="my-8">
    <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{{ title }}</h2>
    <div class="relative">
      <button
        @click="scrollLeft"
        class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md z-10 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >◀️</button>
      <div
        ref="container"
        class="flex overflow-x-auto space-x-4 snap-x snap-mandatory scrollbar-hide px-4"
      >
        <div
          v-for="prod in products"
          :key="prod.id"
          class="snap-center flex-shrink-0 w-64"
        >
          <ProductCard :product="prod" />
        </div>
      </div>
      <button
        @click="scrollRight"
        class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md z-10 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >▶️</button>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>