<template>
  <div class="card">
    <div class="image-container">
      <img :src="product.thumbnail" :alt="product.title" />
      <span class="category-tag">{{ product.category }}</span>
    </div>
    
    <div class="card-body">
      <h3 class="product-title">{{ product.title }}</h3>
      <p class="manufacturer">By {{ product.brand }}</p>
      
      <div class="price-row">
        <span class="price">${{ product.price }}</span>
        <span :class="['stock-status', product.stock < 10 ? 'critical' : 'stable']">
          {{ product.stock }} in stock
        </span>
      </div>

      <button class="buy-button">
        Add to Project
      </button>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #eee;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0,0,0,0.1);
}

.image-container {
  position: relative;
  height: 200px;
  background: #fff;
}

img { width: 100%; height: 100%; object-fit: contain; padding: 10px; }

.category-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(44, 62, 80, 0.8);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
}

.card-body { padding: 20px; }

.product-title {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  color: #333;
}

.manufacturer {
  font-size: 0.85rem;
  color: #7f8c8d;
  margin-bottom: 15px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #27ae60;
}

.stock-status { font-size: 0.8rem; padding: 2px 8px; border-radius: 4px; }
.stable { background: #e8f5e9; color: #2e7d32; }
.critical { background: #ffebee; color: #c62828; }

.buy-button {
  width: 100%;
  background: #3498db;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.buy-button:hover { background: #2980b9; }
</style>