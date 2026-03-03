<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import NavBar from '../components/NavBar.vue'
import type { Product } from '../types/Product'
import { useSearchStore } from '../stores/search'

const products = ref<Product[]>([])
const flashProducts = ref<Product[]>([])
const categories = ref<string[]>(['All', 'Beauty', 'Fragrances', 'Furniture', 'Groceries', 'Laptops', 'Smartphones', 'Tops'])
const currentCategory = ref('All')
const isLoading = ref<boolean>(true)
const search = useSearchStore()
const isFlashExpanded = ref(false)

const timeLeft = ref({ hours: 12, minutes: 45, seconds: 30 })

const updateTimer = () => {
  setInterval(() => {
    if (timeLeft.value.seconds > 0) {
      timeLeft.value.seconds--
    } else {
      timeLeft.value.seconds = 59
      if (timeLeft.value.minutes > 0) {
        timeLeft.value.minutes--
      } else {
        timeLeft.value.minutes = 59
        if (timeLeft.value.hours > 0) timeLeft.value.hours--
      }
    }
  }, 1000)
}

const fetchProducts = async () => {
  isLoading.value = true
  try {
    // Regular Products
    let url = 'https://dummyjson.com/products?limit=50'
    if (search.query) {
      url = `https://dummyjson.com/products/search?q=${search.query}`
    } else if (currentCategory.value !== 'All') {
      url = `https://dummyjson.com/products/category/${currentCategory.value.toLowerCase()}`
    }
    const res = await fetch(url)
    const data = await res.json()
    products.value = data.products

    // Flash Sale Products (Specific IDs for better visuals)
    if (!flashProducts.value.length) {
      const flashRes = await fetch('https://dummyjson.com/products?limit=18&skip=10')
      const flashData = await flashRes.json()
      flashProducts.value = flashData.products.map((p: any) => ({
        ...p,
        oldPrice: (p.price * 1.5).toFixed(2),
        discount: Math.floor(Math.random() * 20) + 30
      }))
    }
  } catch (error) {
    console.error('Fetch error:', error)
  } finally {
    isLoading.value = false
  }
}

const selectCategory = (cat: string) => {
  currentCategory.value = cat
  if (cat !== 'All') search.query = '' // Clear search if a specific category is chosen
  fetchProducts()
}

const scrollToProducts = () => {
  document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  fetchProducts()
  updateTimer()
})

watch(() => search.query, () => {
  if (search.query) currentCategory.value = 'All'
  fetchProducts()
})
const toggleFlash = () => {
  isFlashExpanded.value = !isFlashExpanded.value
}

const visibleFlashProducts = computed(() => {
  return isFlashExpanded.value ? flashProducts.value : flashProducts.value.slice(0, 6)
})
</script>

<template>
  <NavBar />

  <main class="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-500">
    <!-- Categories / Promo Bar -->
    <div class="bg-[var(--card-bg)] border-b border-[var(--border-color)]">
      <div class="max-w-7xl mx-auto px-4 flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
        <button 
          v-for="cat in categories" 
          :key="cat" 
          @click="selectCategory(cat)"
          :class="['px-4 py-1 text-xs font-bold rounded-full transition-all border shrink-0', currentCategory === cat ? 'bg-[#ff6600] border-[#ff6600] text-white' : 'bg-transparent border-transparent text-[var(--text-muted)] hover:text-[#ff6600]']"
        >
          {{ cat.toUpperCase() }}
        </button>
      </div>
    </div>

    <!-- Flash Sale Section -->
    <section v-if="!search.query && currentCategory === 'All'" class="max-w-7xl mx-auto px-4 mt-8">
      <div class="bg-[var(--card-bg)] rounded-sm border border-[var(--border-color)] overflow-hidden shadow-sm">
        <div class="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
          <div class="flex items-center gap-6">
            <h2 class="text-[#ff6600] font-bold uppercase text-sm">Flash Sale</h2>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold uppercase text-[var(--text-muted)]">Ending in</span>
              <div class="flex gap-1.5">
                <span class="bg-[#ff6600] text-white px-1.5 py-0.5 rounded-sm font-bold text-xs">{{ String(timeLeft.hours).padStart(2, '0') }}</span>
                <span class="text-[#ff6600] font-bold">:</span>
                <span class="bg-[#ff6600] text-white px-1.5 py-0.5 rounded-sm font-bold text-xs">{{ String(timeLeft.minutes).padStart(2, '0') }}</span>
                <span class="text-[#ff6600] font-bold">:</span>
                <span class="bg-[#ff6600] text-white px-1.5 py-0.5 rounded-sm font-bold text-xs">{{ String(timeLeft.seconds).padStart(2, '0') }}</span>
              </div>
            </div>
          </div>
          <button 
            @click="toggleFlash"
            class="text-[#ff6600] text-xs font-bold uppercase border border-[#ff6600] px-4 py-1.5 rounded-sm transition-all hover:bg-[#ff6600] hover:text-white"
          >
            {{ isFlashExpanded ? 'Show Less' : 'Shop All' }}
          </button>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[1px] bg-[var(--border-color)] transition-all duration-500">
          <div v-for="item in visibleFlashProducts" :key="item.id" class="bg-[var(--card-bg)] p-4 group cursor-pointer hover:shadow-xl transition-all relative animate-fade-in">
            <div class="absolute top-2 left-2 bg-[#ff6600] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm z-10 shrink-0">
              -{{ item.discount }}%
            </div>
            <div class="aspect-square mb-3 overflow-hidden rounded-sm bg-white p-2">
              <img :src="item.thumbnail" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h4 class="text-xs font-bold text-gray-800 dark:text-gray-100 line-clamp-1 mb-1 truncate">{{ item.title }}</h4>
            <div class="flex flex-col">
              <span class="text-lg font-bold text-[#ff6600]">${{ item.price }}</span>
              <span class="text-[10px] text-gray-400 line-through">${{ item.oldPrice }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Classic Banner -->
    <section class="max-w-7xl mx-auto px-4 mt-8">
      <div class="relative h-[240px] rounded-sm overflow-hidden bg-[#ff6600] shadow-sm group">
        <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>
        <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2000" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
        <div class="relative z-20 h-full flex flex-col justify-center px-12 text-white">
          <span class="text-xs font-bold uppercase tracking-widest mb-2 text-yellow-400">Limited Time Offer</span>
          <h2 class="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">THE REAL SALE <br/>IS FINALLY HERE</h2>
          <button 
            @click="scrollToProducts"
            class="group/btn w-fit px-8 py-3 bg-[#ff6600] hover:bg-white hover:text-[#ff6600] text-white font-bold rounded-sm transition-all shadow-lg transform active:scale-95 flex items-center gap-2"
          >
            SHOP NOW
            <span class="transition-transform group-hover/btn:translate-x-1 font-black text-lg">→</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Products Grid -->
    <section id="products-grid" class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 uppercase tracking-tight">
          {{ search.query ? `Results for "${search.query}"` : (currentCategory === 'All' ? 'Just For You' : currentCategory) }}
        </h3>
        <div class="h-0.5 flex-grow mx-4 bg-gray-200 dark:bg-gray-800"></div>
      </div>

      <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div v-for="i in 12" :key="i" class="aspect-[3/4] bg-[var(--card-bg)] rounded-md animate-pulse"></div>
      </div>

      <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        <ProductCard
          v-for="item in products"
          :key="item.id"
          :product="item"
        />
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && products.length === 0" class="text-center py-24 bg-[var(--card-bg)] rounded border border-[var(--border-color)] mt-8">
        <p class="text-gray-500 font-bold uppercase">No products found</p>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="bg-[#222] text-[#ccc] py-12 mt-12 border-t-4 border-[#ff6600]">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
      <div class="space-y-4">
        <h4 class="text-white font-bold uppercase">Customer Care</h4>
        <ul class="space-y-2 opacity-80">
          <li>Handshake</li>
          <li>Help Center</li>
          <li>How to Buy</li>
          <li>Corporate & Bulk Purchasing</li>
        </ul>
      </div>
      <div class="space-y-4">
        <h4 class="text-white font-bold uppercase">OnlineStore</h4>
        <ul class="space-y-2 opacity-80">
          <li>About Us</li>
          <li>Digital Payments</li>
          <li>OnlineStore Cares</li>
          <li>Privacy Policy</li>
        </ul>
      </div>
      <div class="space-y-4">
        <h4 class="text-white font-bold uppercase">Contact Us</h4>
        <p class="opacity-80 leading-relaxed">
          123 Commerce Way, Tech City<br/>
          support@onlinestore.com<br/>
          +1 234 567 890
        </p>
      </div>
      <div class="space-y-4">
         <h4 class="text-white font-bold uppercase">Follow Us</h4>
         <div class="flex gap-4 grayscale opacity-60">
            <span>🔵</span> <span>🐦</span> <span>📸</span> <span>📺</span>
         </div>
      </div>
    </div>
    <div class="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/10 text-center opacity-40 text-xs">
      &copy; 2024 OnlineStore. All rights reserved.
    </div>
  </footer>
</template>