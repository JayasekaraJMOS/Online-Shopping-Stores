<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import NavBar from '../components/NavBar.vue'
import type { Product } from '../types/Product'
import { useSearchStore } from '../stores/search'
import { useCurrencyStore } from '../stores/currency'
import { useLanguageStore } from '../stores/language'
import { useNotificationStore } from '../stores/notification'
import { useChatStore } from '../stores/chatbot'
import { useCartStore } from '../stores/cart'

const router = useRouter()
const chat = useChatStore()
const cart = useCartStore()

const products = ref<Product[]>([])
const flashProducts = ref<Product[]>([])
const categories = ref<string[]>(['All', 'Beauty', 'Fragrances', 'Furniture', 'Groceries', 'Laptops', 'Smartphones', 'Tops'])

const getCategoryIcon = (cat: string) => {
  const map: Record<string, string> = {
    'All': '✨', 'Beauty': '💄', 'Fragrances': '🌸', 'Furniture': '🛋️', 
    'Groceries': '🛒', 'Laptops': '💻', 'Smartphones': '📱', 'Tops': '👕'
  }
  return map[cat] || '🛍️'
}
const currentCategory = ref('All')
const isLoading = ref<boolean>(true)
const search = useSearchStore()
const currency = useCurrencyStore()
const language = useLanguageStore()
const notification = useNotificationStore()
const isFlashExpanded = ref(false)

// ─── Bonus state ────────────────────────────────────────────────────────────
const bonusClaimed = ref(localStorage.getItem('bonus_claimed') === 'true')
const copiedCoupon = ref<string | null>(null)

async function copyToClipboard(code: string) {
  // 1. Copy to clipboard
  try {
    await navigator.clipboard.writeText(code)
  } catch {
    const el = document.createElement('textarea')
    el.value = code
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
  
  // 2. Auto-apply to cart
  if (cart.appliedCoupon === code) {
    notification.add(`✅ Coupon ${code} is already applied!`, 'info')
  } else {
    const result = cart.applyCoupon(code)
    if (result.success) {
      notification.add(`🎉 Coupon ${code} applied! ${result.message}`, 'success', 5000)
    } else {
      notification.add(`📋 Copied ${code} — ${result.message}`, 'warning', 4000)
    }
  }

  copiedCoupon.value = code
  setTimeout(() => { copiedCoupon.value = null }, 2500)
}

const claimBonus = async () => {
  if (bonusClaimed.value) {
    notification.add('You have already claimed your new-user bonus!', 'warning')
    return
  }
  await copyToClipboard('NEWUSER10')
  bonusClaimed.value = true
  localStorage.setItem('bonus_claimed', 'true')
}

// ─── Coupons ─────────────────────────────────────────────────────────────────
const saveMoreCoupons = [
  { id: 1, off: '15%', label: 'ELECTRONICS', code: 'ELEC15',  color: '#2563EB', bg: '#EFF6FF', min: 50 },
  { id: 2, off: '20%', label: 'FASHION',     code: 'STYLE20', color: '#7C3AED', bg: '#F5F3FF', min: 30 },
  { id: 3, off: '10%', label: 'GROCERIES',   code: 'FRESH10', color: '#059669', bg: '#ECFDF5', min: 20 },
  { id: 4, off: '25%', label: 'BEAUTY',      code: 'GLOW25',  color: '#DB2777', bg: '#FDF2F8', min: 40 },
  { id: 5, off: '30%', label: 'HOME & LIVING',code: 'HOME30', color: '#D97706', bg: '#FFFBEB', min: 80 },
]

const bundleDeals = [
  { id: 1, icon: '📱', title: 'Phone + Case Bundle', save: 35, label: 'Tech Combo' },
  { id: 2, icon: '👟', title: 'Buy 2 Get 1 Free',   save: 33, label: 'Fashion' },
  { id: 3, icon: '🧴', title: 'Skincare Trio Pack',  save: 28, label: 'Beauty' },
  { id: 4, icon: '🏠', title: 'Home Essentials Kit', save: 40, label: 'Home' },
]

// ─── Flash Sale Timer ─────────────────────────────────────────────────────────
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

// ─── Products ─────────────────────────────────────────────────────────────────
const fetchProducts = async () => {
  isLoading.value = true
  try {
    let url = 'https://dummyjson.com/products?limit=100' // Increased limit for better local filtering
    if (search.query) {
      url = `https://dummyjson.com/products/search?q=${search.query}&limit=100`
    } else if (currentCategory.value !== 'All') {
      url = `https://dummyjson.com/products/category/${currentCategory.value.toLowerCase()}`
    }
    const res = await fetch(url)
    const data = await res.json()
    
    // Local filter if category is selected during search
    if (search.query && currentCategory.value !== 'All') {
      products.value = data.products.filter((p: Product) => 
        p.category.toLowerCase() === currentCategory.value.toLowerCase()
      )
    } else {
      products.value = data.products
    }

    if (!flashProducts.value.length) {
      const flashRes = await fetch('https://dummyjson.com/products?limit=18&skip=10')
      const flashData = await flashRes.json()
      flashProducts.value = flashData.products.map((p: Product) => ({
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
  if (cat !== 'All') search.query = ''
  fetchProducts()
}

const scrollToProducts = () => {
  document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' })
}

const toggleFlash = () => { isFlashExpanded.value = !isFlashExpanded.value }

const visibleFlashProducts = computed(() =>
  isFlashExpanded.value ? flashProducts.value : flashProducts.value.slice(0, 6)
)

const sortedProducts = computed(() => {
  const list = [...products.value]
  switch (search.sortBy) {
    case 'price_asc':  return list.sort((a, b) => a.price - b.price)
    case 'price_desc': return list.sort((a, b) => b.price - a.price)
    case 'rating':     return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    case 'newest':     return list.sort((a, b) => b.id - a.id)
    default:           return list
  }
})

onMounted(() => {
  fetchProducts()
  updateTimer()
  chat.setContextProduct(null)
})

watch(() => search.query, () => {
  fetchProducts()
})

watch(() => search.sortBy, () => {
  // sortedProducts is computed — no refetch needed
})

</script>

<template>
  <NavBar />

  <main class="min-h-screen bg-(--bg-color) text-(--text-color) transition-colors duration-500">

    <!-- ── Categories Bar ───────────────────────────────────────── -->
    <div class="bg-(--card-bg) border-b border-(--border-color) shadow-sm">
      <div class="max-w-7xl mx-auto px-4 flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectCategory(cat)"
          :class="['px-5 py-2 text-[11px] font-black rounded-full transition-all border shrink-0 uppercase tracking-widest flex items-center gap-2',
            currentCategory === cat
              ? 'bg-linear-to-r from-(--accent-color) to-blue-500 border-transparent text-white shadow-lg shadow-blue-500/30 scale-105 ring-2 ring-white/20'
              : 'bg-(--card-bg) border-(--border-color) text-(--text-muted) hover:text-(--accent-color) hover:border-(--accent-color)/40 hover:bg-blue-50/50 dark:hover:bg-blue-900/20']"
        >
          <span class="text-base drop-shadow-sm group-hover:scale-110 transition-transform">{{ getCategoryIcon(cat) }}</span>
          {{ language.translateDynamic(cat).toUpperCase() }}
        </button>
      </div>
    </div>

    <!-- ── Flash Sale ───────────────────────────────────────────── -->
    <section v-if="!search.query && currentCategory === 'All'" class="max-w-7xl mx-auto px-4 mt-8">
      <div class="bg-(--card-bg) rounded-2xl border border-(--border-color) overflow-hidden shadow-lg">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-5 py-3.5 border-b border-(--border-color) bg-linear-to-r from-(--promo-color)/5 to-transparent gap-3 sm:gap-0">
          <div class="flex items-center gap-3 sm:gap-5 flex-wrap">
            <h2 class="text-(--promo-color) font-black uppercase text-sm tracking-widest flex items-center gap-2">
              <span class="animate-pulse">🔥</span> {{ language.t.flashSale }}
            </h2>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-black uppercase text-(--text-muted) tracking-tighter">{{ language.t.endingIn }}</span>
              <div class="flex gap-1">
                <span class="bg-(--promo-color) text-white px-2 py-0.5 rounded-md shadow font-black text-xs tabular-nums">{{ String(timeLeft.hours).padStart(2, '0') }}</span>
                <span class="text-(--promo-color) font-black self-center">:</span>
                <span class="bg-(--promo-color) text-white px-2 py-0.5 rounded-md shadow font-black text-xs tabular-nums">{{ String(timeLeft.minutes).padStart(2, '0') }}</span>
                <span class="text-(--promo-color) font-black self-center">:</span>
                <span class="bg-(--promo-color) text-white px-2 py-0.5 rounded-md shadow font-black text-xs tabular-nums">{{ String(timeLeft.seconds).padStart(2, '0') }}</span>
              </div>
            </div>
          </div>
          <button
            @click="toggleFlash"
            class="text-(--accent-color) text-xs font-black uppercase border-2 border-(--accent-color) px-5 py-1.5 rounded-lg transition-all hover:bg-(--accent-color) hover:text-white shadow-sm hover:shadow-md"
          >
            {{ isFlashExpanded ? language.t.showLess : language.t.shopAll }}
          </button>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-(--border-color)">
          <div
            v-for="item in visibleFlashProducts"
            :key="item.id"
            @click="router.push(`/product/${item.id}`)"
            class="bg-(--card-bg) p-4 group cursor-pointer hover:shadow-xl transition-all relative animate-fade-in hover:z-10"
          >
            <div class="absolute top-2 left-2 bg-(--promo-color) text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow z-10">
              -{{ item.discount }}% {{ language.t.off }}
            </div>
            <div class="aspect-square mb-3 overflow-hidden rounded-xl bg-white p-3 shadow-inner">
              <img :src="item.thumbnail" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h4 class="text-xs font-bold text-(--text-color) line-clamp-1 mb-1 truncate group-hover:text-(--accent-color) transition-colors">
              {{ language.translateDynamic(item.title) }}
            </h4>
            <div class="flex items-baseline gap-2">
              <span class="text-base font-black text-(--promo-color)">{{ currency.format(item.price) }}</span>
              <span class="text-[10px] text-(--text-muted) line-through opacity-60">{{ currency.format(Number(item.oldPrice)) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Save More + Coupons ─────────────────────────────────── -->
    <section v-if="!search.query && currentCategory === 'All'" class="max-w-7xl mx-auto px-4 mt-8">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-5">
        <h2 class="text-sm font-black uppercase tracking-widest text-(--text-color) flex items-center gap-2 shrink-0">
          <span class="text-xl">🏷️</span> {{ language.t.saveMore }}
        </h2>
        <div class="h-px grow bg-(--border-color)"></div>
        <span class="text-xs font-bold text-(--text-muted) uppercase tracking-widest shrink-0">{{ language.t.exclusiveDeals }}</span>
      </div>

      <!-- ── New User Bonus Banner ──────────────────────────────── -->
      <div
        class="relative overflow-hidden rounded-2xl mb-5 px-5 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl"
        style="background: linear-gradient(135deg, #2563EB 0%, #7C3AED 60%, #DB2777 100%);"
      >
        <!-- shimmer -->
        <div class="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none"></div>
        <!-- decorative circles -->
        <div class="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none"></div>
        <div class="absolute -right-2 top-10 w-16 h-16 rounded-full bg-white/10 pointer-events-none"></div>
        <div class="absolute left-1/2 -bottom-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none"></div>

        <div class="flex items-center gap-4 relative">
          <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0">🎁</div>
          <div>
            <p class="text-white font-black text-sm uppercase tracking-wide">{{ language.t.newUserBonus }}</p>
            <p class="text-white/80 text-xs font-semibold mt-0.5">{{ language.t.firstOrderDiscount }}</p>
            <p v-if="bonusClaimed" class="text-green-300 text-[10px] font-black mt-1 uppercase tracking-widest">✅ Use code: NEWUSER10 at checkout</p>
          </div>
        </div>

        <button
          @click="claimBonus"
          :disabled="bonusClaimed"
          class="relative bg-white font-black text-xs uppercase tracking-widest px-6 py-2.5 rounded-xl shadow-lg transition-all shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
          :class="bonusClaimed ? 'text-green-600' : 'text-[#2563EB] hover:scale-105 active:scale-95'"
        >
          {{ bonusClaimed ? language.translateDynamic('✅ Claimed!') : language.t.claimNow }}
        </button>
      </div>

      <!-- ── Coupon Cards ───────────────────────────────────────── -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        <div
          v-for="c in saveMoreCoupons"
          :key="c.id"
          class="coupon-card group rounded-xl border-2 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          :style="{ borderColor: c.color, backgroundColor: c.bg }"
        >
          <div class="relative flex items-center gap-2 px-3 pt-3 pb-2" :style="{ borderBottom: `1.5px dashed ${c.color}40` }">
            <span class="text-3xl font-black leading-none" :style="{ color: c.color }">{{ c.off }}</span>
            <div>
              <p class="text-[10px] font-black uppercase" :style="{ color: c.color }">{{ c.label }}</p>
              <p class="text-[10px] text-(--text-muted)">{{ language.t.minSpend }} ${{ c.min }}</p>
            </div>
            <!-- Notches -->
            <div class="absolute -left-2 -bottom-2 w-4 h-4 rounded-full bg-(--bg-color) border border-(--border-color) z-10"></div>
            <div class="absolute -right-2 -bottom-2 w-4 h-4 rounded-full bg-(--bg-color) border border-(--border-color) z-10"></div>
          </div>
          <div class="px-3 py-2 flex items-center justify-between">
            <code class="text-[9px] font-black tracking-widest uppercase" :style="{ color: c.color }">{{ c.code }}</code>
            <button
              @click="copyToClipboard(c.code)"
              class="text-[9px] font-black uppercase border rounded-md px-2 py-1 transition-all"
              :style="copiedCoupon === c.code
                ? { backgroundColor: '#16a34a', borderColor: '#16a34a', color: 'white' }
                : { borderColor: c.color, color: c.color }"
            >
              {{ copiedCoupon === c.code ? language.translateDynamic('✓ Copied') : language.t.copy }}
            </button>
          </div>
        </div>
      </div>

      <!-- ── Bundle Deals ───────────────────────────────────────── -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div
          v-for="deal in bundleDeals"
          :key="deal.id"
          class="flex items-center gap-3 bg-(--card-bg) border border-(--border-color) rounded-xl px-4 py-3 cursor-pointer hover:border-(--accent-color) hover:shadow-md transition-all duration-300 group"
        >
          <span class="text-2xl group-hover:scale-110 transition-transform duration-300">{{ deal.icon }}</span>
          <div class="min-w-0">
            <p class="text-xs font-black text-(--text-color) truncate">{{ deal.title }}</p>
            <p class="text-[10px] text-(--text-muted)">{{ deal.label }} · <span class="font-black text-(--cta-color)">Save {{ deal.save }}%</span></p>
          </div>
          <span class="ml-auto text-(--accent-color) text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity shrink-0">→</span>
        </div>
      </div>
    </section>

    <!-- ── Hero Banner ────────────────────────────────────────── -->
    <section class="max-w-7xl mx-auto px-4 mt-8">
      <div class="relative h-50 md:h-75 rounded-2xl overflow-hidden shadow-2xl group border border-(--border-color)">
        <div class="absolute inset-0 bg-linear-to-r from-[#0F172A] via-[#0F172A]/50 to-transparent z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2000"
          class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
        <div class="relative z-20 h-full flex flex-col justify-center px-6 md:px-16 text-white">
          <span class="text-[9px] md:text-xs font-black uppercase tracking-[0.25em] mb-2 text-(--promo-color) bg-(--promo-color)/20 w-fit px-3 py-1 rounded-full">
            {{ language.t.limitedTimeOffer }}
          </span>
          <h2 class="text-3xl md:text-6xl font-black mb-5 leading-tight tracking-tight drop-shadow-lg">
            {{ language.t.realSale }}<br/>
            <span class="text-transparent bg-clip-text bg-linear-to-r from-(--promo-color) to-yellow-300 drop-shadow-sm">{{ language.t.isFinallyHere }}</span>
          </h2>
          <button
            @click="scrollToProducts"
            class="group/btn w-fit px-8 md:px-10 py-3.5 bg-linear-to-r from-(--cta-color) to-emerald-400 text-white font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transform active:scale-95 flex items-center gap-3 uppercase tracking-widest text-[11px] md:text-sm border border-white/20"
          >
            {{ language.t.shopNow }}
            <span class="transition-transform duration-300 group-hover/btn:translate-x-2 text-xl">🚀</span>
          </button>
        </div>
        <!-- floating badge -->
        <div class="absolute top-4 right-4 z-20 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg animate-bounce">
          {{ language.translateDynamic('UP TO 50% OFF') }}
        </div>
      </div>
    </section>

    <!-- ── Products Grid ──────────────────────────────────────── -->
    <section id="products-grid" class="max-w-7xl mx-auto px-4 py-10">
      <div class="flex items-center gap-4 mb-8">
        <div class="flex flex-col">
          <h3 class="text-2xl font-black text-(--text-color) uppercase tracking-tight leading-tight">
            {{ search.query
              ? `${language.t.resultsFor} "${search.query}"`
              : currentCategory === 'All'
                ? language.t.justForYou
                : language.translateDynamic(currentCategory) }}
          </h3>
          <div v-if="!isLoading" class="text-[10px] text-(--text-muted) font-bold uppercase tracking-widest mt-0.5">
            {{ products.length }} {{ language.translateDynamic('products found') }}
          </div>
        </div>
        <div class="h-0.5 grow bg-linear-to-r from-(--accent-color)/30 to-transparent rounded-full"></div>
      </div>

      <!-- Skeleton -->
      <div v-if="isLoading" class="products-grid">
        <div v-for="i in 12" :key="i" class="aspect-3/4 bg-(--card-bg) rounded-2xl animate-pulse border border-(--border-color)"></div>
      </div>

      <div v-else class="products-grid">
        <ProductCard 
          v-for="(item, index) in sortedProducts" 
          :key="item.id" 
          :product="item" 
          class="animate-fade-in"
          :class="`delay-${(index % 5) * 100 + 100}`"
        />
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && products.length === 0" class="text-center py-24 bg-(--card-bg) rounded-2xl border border-(--border-color) mt-4">
        <div class="text-6xl mb-4 opacity-20">🔍</div>
        <p class="text-(--text-muted) font-black uppercase tracking-widest text-sm">{{ language.t.noProductsFound }}</p>
      </div>
    </section>
  </main>

  <!-- ── Footer ────────────────────────────────────────────────── -->
  <footer class="bg-[#0F172A] text-slate-300 mt-4">
    <!-- Top accent line -->
    <div class="h-1 w-full bg-linear-to-r from-[#2563EB] via-[#7C3AED] to-[#DB2777]"></div>

    <div class="max-w-7xl mx-auto px-6 pt-14 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-sm">
      <!-- Brand -->
      <div class="space-y-4 lg:col-span-1">
        <h3 class="text-white font-black text-2xl tracking-tight">{{ language.translateDynamic('OMAX') }}</h3>
        <p class="text-slate-400 text-xs leading-relaxed max-w-50">
          {{ language.translateDynamic('The smarter way to shop. Millions of products, unbeatable prices, delivered fast.') }}
        </p>
        <div class="flex gap-3">
          <a href="#" class="w-9 h-9 bg-white/10 hover:bg-[#2563EB] rounded-lg flex items-center justify-center text-sm transition-colors text-white no-underline">🔵</a>
          <a href="#" class="w-9 h-9 bg-white/10 hover:bg-sky-500 rounded-lg flex items-center justify-center text-sm transition-colors text-white no-underline">🐦</a>
          <a href="#" class="w-9 h-9 bg-white/10 hover:bg-pink-600 rounded-lg flex items-center justify-center text-sm transition-colors text-white no-underline">📸</a>
          <a href="#" class="w-9 h-9 bg-white/10 hover:bg-red-600 rounded-lg flex items-center justify-center text-sm transition-colors text-white no-underline">📺</a>
        </div>
      </div>

      <div class="space-y-4">
        <h4 class="text-white font-black text-xs uppercase tracking-[0.2em]">{{ language.translateDynamic('Customer Care') }}</h4>
        <ul class="space-y-2.5 text-xs">
          <li><a href="#" class="text-slate-400 hover:text-white transition-colors flex items-center gap-2 no-underline font-medium"><span class="text-(--accent-color)">›</span> {{ language.translateDynamic('Help Center') }}</a></li>
          <li><a href="#" class="text-slate-400 hover:text-white transition-colors flex items-center gap-2 no-underline font-medium"><span class="text-(--accent-color)">›</span> {{ language.translateDynamic('How to Buy') }}</a></li>
          <li><a href="#" class="text-slate-400 hover:text-white transition-colors flex items-center gap-2 no-underline font-medium"><span class="text-(--accent-color)">›</span> {{ language.translateDynamic('Returns & Refunds') }}</a></li>
          <li><a href="#" class="text-slate-400 hover:text-white transition-colors flex items-center gap-2 no-underline font-medium"><span class="text-(--accent-color)">›</span> {{ language.translateDynamic('Track Your Order') }}</a></li>
        </ul>
      </div>

      <div class="space-y-4">
        <h4 class="text-white font-black text-xs uppercase tracking-[0.2em]">{{ language.translateDynamic('About OMAX') }}</h4>
        <ul class="space-y-2.5 text-xs">
          <li><a href="#" class="text-slate-400 hover:text-white transition-colors flex items-center gap-2 no-underline font-medium"><span class="text-(--accent-color)">›</span> {{ language.translateDynamic('About Us') }}</a></li>
          <li><a @click="router.push('/become-a-seller')" href="#" class="text-slate-400 hover:text-white transition-colors flex items-center gap-2 no-underline font-medium cursor-pointer"><span class="text-(--accent-color)">›</span> {{ language.translateDynamic('Become a Seller') }}</a></li>
          <li><a href="#" class="text-slate-400 hover:text-white transition-colors flex items-center gap-2 no-underline font-medium"><span class="text-(--accent-color)">›</span> {{ language.translateDynamic('Privacy Policy') }}</a></li>
          <li><a href="#" class="text-slate-400 hover:text-white transition-colors flex items-center gap-2 no-underline font-medium"><span class="text-(--accent-color)">›</span> {{ language.translateDynamic('Terms of Use') }}</a></li>
        </ul>
      </div>

      <div class="space-y-4">
        <h4 class="text-white font-black text-xs uppercase tracking-[0.2em]">{{ language.translateDynamic('Get in Touch') }}</h4>
        <div class="space-y-3 text-xs text-slate-400">
          <div class="flex items-start gap-2"><span>📍</span><span>{{ language.translateDynamic('123 Commerce Way, Tech City') }}</span></div>
          <div class="flex items-start gap-2"><span>✉️</span><a href="mailto:support@omax.store" class="hover:text-white transition-colors no-underline">support@omax.store</a></div>
          <div class="flex items-start gap-2"><span>📞</span><a href="tel:+1234567890" class="hover:text-white transition-colors no-underline">+1 234 567 890</a></div>
        </div>
        <div class="flex gap-2 mt-3">
          <input type="email" :placeholder="language.translateDynamic('Your email')" class="flex-1 bg-white/10 border border-white/20 text-white text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-(--accent-color) placeholder:text-slate-500 transition-colors" />
          <button class="bg-(--accent-color) text-white text-xs font-black px-3 py-2 rounded-lg hover:opacity-90 transition-opacity shrink-0">→</button>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-white/10">
      <div class="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <span>© {{ new Date().getFullYear() }} OMAX Online Store · Jayasekara J.M.O.S.</span>
        <div class="flex items-center gap-3">
          <span class="bg-white/10 px-2 py-1 rounded text-[10px]">💳 Visa</span>
          <span class="bg-white/10 px-2 py-1 rounded text-[10px]">💳 Mastercard</span>
          <span class="bg-white/10 px-2 py-1 rounded text-[10px]">🌍 PayPal</span>
        </div>
      </div>
    </div>
  </footer>
</template>


