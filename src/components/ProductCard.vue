<script setup lang="ts">
// This import uses the file you just uploaded!
import type { Product } from '../types/Product';

defineProps<{
  product: Product
}>();
</script>

<template>
  <div class="product-card">
    <img :src="product.thumbnail" :alt="product.title" />
    <div class="info">
      <h3>{{ product.title }}</h3>
      <p class="price">${{ product.price }}</p>
      <button>View Details</button>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
}
.product-card:hover { transform: scale(1.02); }
img { width: 100%; height: 200px; object-fit: cover; }
.info { padding: 15px; }
.price { font-weight: bold; color: #2c3e50; }
</style>