<script setup lang="ts">
// Props setup
defineProps<{
  product: any;
}>();
</script>

<template>
  <div class="card">
    <div class="image-box">
      <img :src="product.thumbnail" :alt="product.title" />
    </div>
    <div class="card-info">
      <h3>{{ product.title }}</h3>
      <p class="price">${{ product.price }}</p>
      <button class="add-btn">Add to Project</button>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: var(--card-bg);
  color: var(--text-color);
  border-radius: 15px;
  padding: 15px;
  text-align: center;
  border: 1px solid rgba(128, 128, 128, 0.2);
  transition: transform 0.2s;
}

.card:hover { transform: translateY(-5px); }

.image-box { width: 100%; height: 180px; background: white; border-radius: 8px; margin-bottom: 10px; }
.image-box img { width: 100%; height: 100%; object-fit: contain; }

.price { font-size: 1.4rem; font-weight: bold; color: #2ecc71; margin: 10px 0; }
.add-btn { width: 100%; padding: 10px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; }
</style>