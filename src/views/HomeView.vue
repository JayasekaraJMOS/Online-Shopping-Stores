<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import NavBar from '../components/NavBar.vue'
import type { Product } from '../types/Product'
import { useSearchStore } from '../stores/search'
import { useCurrencyStore } from '../stores/currency'

const router = useRouter()

const products = ref<Product[]>([])
const flashProducts = ref<Product[]>([])
const categories = ref<string[]>(['All', 'Beauty', 'Fragrances', 'Furniture', 'Groceries', 'Laptops', 'Smartphones', 'Tops'])
const currentCategory = ref('All')
const isLoading = ref<boolean>(true)
const search = useSearchStore()
const currency = useCurrencyStore()
const isFlashExpanded = ref(false)

const saveMoreCoupons = [
  { id: 1, off: '15%', label: 'ELECTRONICS', code: 'ELEC15', color: '#2563EB', bg: '#EFF6FF', min: 50 },
  { id: 2, off: '20%', label: 'FASHION', code: 'STYLE20', color: '#7C3AED', bg: '#F5F3FF', min: 30 },
  { id: 3, off: '10%', label: 'GROCERIES', code: 'FRESH10', color: '#059669', bg: '#ECFDF5', min: 20 },
  { id: 4, off: '25%', label: 'BEAUTY', code: 'GLOW25', color: '#DB2777', bg: '#FDF2F8', min: 40 },
  { id: 5, off: '30%', label: 'HOME & LIVING', code: 'HOME30', color: '#D97706', bg: '#FFFBEB', min: 80 },
]

const bundleDeals = [
  { id: 1, icon: '📱', title: 'Phone + Case Bundle', save: 35, label: 'Tech Combo' },
  { id: 2, icon: '👟', title: 'Buy 2 Get 1 Free', save: 33, label: 'Fashion' },
  { id: 3, icon: '🧴', title: 'Skincare Trio Pack', save: 28, label: 'Beauty' },
  { id: 4, icon: '🏠', title: 'Home Essentials Kit', save: 40, label: 'Home' },
]

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
          :class="['px-4 py-1 text-xs font-bold rounded-full transition-all border shrink-0', currentCategory === cat ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-white shadow-md' : 'bg-transparent border-transparent text-[var(--text-muted)] hover:text-[var(--accent-color)]']"
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
            <h2 class="text-[var(--promo-color)] font-black uppercase text-sm tracking-widest flex items-center gap-2">
              <span class="animate-pulse">🔥</span> Flash Sale
            </h2>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-tighter">Ending in</span>
              <div class="flex gap-1">
                <span class="bg-[var(--promo-color)] text-white px-1.5 py-0.5 rounded shadow-sm font-black text-xs">{{ String(timeLeft.hours).padStart(2, '0') }}</span>
                <span class="text-[var(--promo-color)] font-black">:</span>
                <span class="bg-[var(--promo-color)] text-white px-1.5 py-0.5 rounded shadow-sm font-black text-xs">{{ String(timeLeft.minutes).padStart(2, '0') }}</span>
                <span class="text-[var(--promo-color)] font-black">:</span>
                <span class="bg-[var(--promo-color)] text-white px-1.5 py-0.5 rounded shadow-sm font-black text-xs">{{ String(timeLeft.seconds).padStart(2, '0') }}</span>
              </div>
            </div>
          </div>
          <button 
            @click="toggleFlash"
            class="text-[var(--accent-color)] text-xs font-black uppercase border-2 border-[var(--accent-color)] px-5 py-1.5 rounded-lg transition-all hover:bg-[var(--accent-color)] hover:text-white shadow-sm hover:shadow-md"
          >
            {{ isFlashExpanded ? 'Show Less' : 'Shop All' }}
          </button>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[1px] bg-[var(--border-color)] transition-all duration-500">
          <div 
            v-for="item in visibleFlashProducts" 
            :key="item.id" 
            @click="router.push(`/product/${item.id}`)"
            class="bg-[var(--card-bg)] p-4 group cursor-pointer hover:shadow-xl transition-all relative animate-fade-in"
          >
            <div class="absolute top-2 left-2 bg-[var(--promo-color)] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-lg z-10 shrink-0">
              -{{ item.discount }}% OFF
            </div>
            <div class="aspect-square mb-3 overflow-hidden rounded-xl bg-white p-3 shadow-inner">
              <img :src="item.thumbnail" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h4 class="text-xs font-bold text-[var(--text-color)] line-clamp-1 mb-1 truncate group-hover:text-[var(--accent-color)] transition-colors">{{ item.title }}</h4>
            <div class="flex items-baseline gap-2">
              <span class="text-lg font-black text-[var(--promo-color)]">{{ currency.format(item.price) }}</span>
              <span class="text-[10px] text-[var(--text-muted)] line-through opacity-60">{{ currency.format(Number(item.oldPrice)) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Save More Section -->
    <section v-if="!search.query && currentCategory === 'All'" class="max-w-7xl mx-auto px-4 mt-8">
      <!-- Section Header -->
      <div class="flex items-center gap-4 mb-4">
        <h2 class="text-sm font-black uppercase tracking-widest text-[var(--text-color)] flex items-center gap-2 shrink-0">
          <span class="text-xl">🏷️</span> Save More
        </h2>
        <div class="h-px flex-grow bg-[var(--border-color)]"></div>
        <span class="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest shrink-0">Exclusive Deals</span>
      </div>

      <!-- Referral / Signup Bonus Strip -->
      <div class="relative overflow-hidden rounded-xl mb-4 px-6 py-3 flex items-center justify-between gap-4 flex-wrap"
        style="background: linear-gradient(135deg, var(--accent-color), #7C3AED);">
        <div class="flex items-center gap-3">
          <span class="text-2xl">🎁</span>
          <div>
            <p class="text-white font-black text-sm uppercase tracking-wide">New User Bonus</p>
            <p class="text-white/70 text-xs">Get <span class="text-white font-black">$10 OFF</span> your first order — no minimum spend!</p>
          </div>
        </div>
        <button class="bg-white text-[var(--accent-color)] font-black text-xs uppercase tracking-widest px-5 py-2 rounded-lg shadow-md hover:scale-105 transition-transform shrink-0">
          Claim Now
        </button>
        <!-- decorative circles -->
        <div class="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none"></div>
        <div class="absolute -right-2 top-8 w-12 h-12 rounded-full bg-white/10 pointer-events-none"></div>
      </div>

      <!-- Coupon Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        <div
          v-for="c in saveMoreCoupons"
          :key="c.id"
          class="coupon-card group rounded-xl border-2 overflow-hidden cursor-pointer select-none hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          :style="{ borderColor: c.color, backgroundColor: c.bg }"
        >
          <!-- Dashed divider notch -->
          <div class="relative flex items-center gap-2 px-3 pt-3 pb-2" :style="{ borderBottom: `1.5px dashed ${c.color}40` }">
            <span class="text-3xl font-black leading-none" :style="{ color: c.color }">{{ c.off }}</span>
            <div>
              <p class="text-[10px] font-black uppercase" :style="{ color: c.color }">{{ c.label }}</p>
              <p class="text-[10px] text-[var(--text-muted)]">Min. spend ${{ c.min }}</p>
            </div>
            <!-- Notches -->
            <div class="absolute -left-2 bottom-[-8px] w-4 h-4 rounded-full bg-[var(--bg-color)] border border-[var(--border-color)] z-10"></div>
            <div class="absolute -right-2 bottom-[-8px] w-4 h-4 rounded-full bg-[var(--bg-color)] border border-[var(--border-color)] z-10"></div>
          </div>
          <div class="px-3 py-2 flex items-center justify-between">
            <code class="text-[9px] font-black tracking-widest uppercase" :style="{ color: c.color }">{{ c.code }}</code>
            <button 
              class="text-[9px] font-black uppercase border rounded px-2 py-0.5 transition-all group-hover:text-white"
              :style="{ borderColor: c.color, color: c.color }"
              @mouseenter="(e) => { (e.target as HTMLElement).style.backgroundColor = c.color }"
              @mouseleave="(e) => { (e.target as HTMLElement).style.backgroundColor = 'transparent'; (e.target as HTMLElement).style.color = c.color }"
            >Copy</button>
          </div>
        </div>
      </div>

      <!-- Bundle Deals Strip -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div
          v-for="deal in bundleDeals"
          :key="deal.id"
          class="flex items-center gap-3 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 cursor-pointer hover:border-[var(--accent-color)] hover:shadow-md transition-all duration-300 group"
        >
          <span class="text-2xl group-hover:scale-110 transition-transform duration-300">{{ deal.icon }}</span>
          <div class="min-w-0">
            <p class="text-xs font-black text-[var(--text-color)] truncate">{{ deal.title }}</p>
            <p class="text-[10px] text-[var(--text-muted)]">{{ deal.label }} &bull; <span class="font-black text-[var(--cta-color)]">Save {{ deal.save }}%</span></p>
          </div>
          <span class="ml-auto text-[var(--accent-color)] text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity shrink-0">→</span>
        </div>
      </div>
    </section>

    <!-- Classic Banner -->
    <section class="max-w-7xl mx-auto px-4 mt-8">
      <div class="relative h-[280px] rounded-2xl overflow-hidden shadow-2xl group border-4 border-white/10">
        <div class="absolute inset-0 bg-gradient-to-r from-[var(--bg-color)] via-[var(--bg-color)]/40 to-transparent z-10"></div>
        <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2000" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
        <div class="relative z-20 h-full flex flex-col justify-center px-16 text-[var(--text-color)]">
          <span class="text-xs font-black uppercase tracking-[0.2em] mb-3 text-[var(--promo-color)] bg-[var(--promo-color)]/20 w-fit px-3 py-1 rounded-full">Limited Time Offer</span>
          <h2 class="text-4xl md:text-6xl font-black mb-6 leading-none tracking-tight">THE REAL SALE <br/><span class="text-[var(--accent-color)]">IS FINALLY HERE</span></h2>
          <button 
            @click="scrollToProducts"
            class="group/btn w-fit px-10 py-4 bg-[var(--cta-color)] hover:bg-[var(--cta-hover)] text-white font-black rounded-xl transition-all shadow-xl transform active:scale-95 flex items-center gap-3 uppercase tracking-widest text-sm"
          >
            SHOP NOW
            <span class="transition-transform group-hover/btn:translate-x-2 text-xl">→</span>
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

      <div v-else class="products-grid">
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
  <footer class="bg-[var(--bg-color)] text-[var(--text-color)] py-16 mt-16 border-t-8 border-[var(--accent-color)]">
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
