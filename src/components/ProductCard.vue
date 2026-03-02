<script setup lang="ts">
// Props setup
defineProps<{
  product: any;
}>();
</script>

<template>
  <div class="card">
    <div class="image-box">
      <img :src="product.thumbnail" :alt="product.title" loading="lazy" />
    </div>
    <div class="card-info">
      <h3 class="product-title">{{ product.title }}</h3>
      <div class="price-row">
        <span class="price">${{ product.price }}</span>
        <span class="stock" v-if="product.stock < 10">Low Stock</span>
      </div>
      <button class="add-btn">Add to Project</button>
    </div>
  </div>
</template>

<style scoped>
.card {
  /* Uses the global CSS variables from App.vue */
  background: var(--card-bg);
  color: var(--text-color);
  border-radius: 20px;
  padding: 15px;
  text-align: center;
  border: 1px solid rgba(128, 128, 128, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
  border-color: var(--accent-color);
}

.image-box {
  width: 100%;
  height: 200px;
  background: #ffffff; /* Keeps product backgrounds clean regardless of theme */
  border-radius: 12px;
  margin-bottom: 15px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-box img {
  width: 90%;
  height: 90%;
  object-fit: contain;
  transition: transform 0.5s ease;
}

.card:hover .image-box img {
  transform: scale(1.1);
}

.product-title {
  font-size: 1.1rem;
  margin: 10px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.price {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2ecc71;
}

.stock {
  font-size: 0.7rem;
  background: #e74c3c;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  text-transform: uppercase;
}

.add-btn {
  width: 100%;
  padding: 12px;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: filter 0.2s, transform 0.1s;
}

.add-btn:hover {
  filter: brightness(1.1);
}

.add-btn:active {
  transform: scale(0.98);
}
</style>