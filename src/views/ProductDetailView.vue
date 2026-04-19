<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useCurrencyStore } from '../stores/currency'
import { useLanguageStore } from '../stores/language'
import { useChatStore } from '../stores/chatbot'
import NavBar from '../components/NavBar.vue'
import type { Product } from '../types/Product'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const currency = useCurrencyStore()
const language = useLanguageStore()
const chat = useChatStore()
const product = ref<Product | null>(null)
const isLoading = ref(true)

onMounted(async () => {
  try {
    const response = await fetch(
      `https://dummyjson.com/products/${route.params.id}`
    )
    const data = await response.json()
    product.value = data
    chat.setContextProduct(data)
  } finally {
    isLoading.value = false
  }
})

const addToCart = () => {
  if (product.value) {
    cart.add(product.value)
  }
}

const buyNow = () => {
  if (product.value) {
    cart.setBuyNow(product.value)
    router.push('/checkout')
  }
}
</script>

<template>
  <NavBar />

  <div class="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-500 pb-12">
    <!-- Breadcrumbs -->
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-tight">
        <button @click="router.push('/')" class="hover:text-[var(--accent-color)] transition-colors">{{ language.t.home }}</button>
        <span>/</span>
        <span class="text-gray-400 capitalize">{{ language.translateDynamic(product?.category || '') }}</span>
        <span>/</span>
        <span class="text-gray-900 dark:text-gray-200 truncate">{{ language.translateDynamic(product?.title || '') }}</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-[60vh]">
      <div class="w-12 h-12 border-4 border-[var(--accent-color)]/20 border-t-[var(--accent-color)] rounded-full animate-spin"></div>
    </div>

    <!-- Product Content -->
    <div v-else-if="product" class="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-6 items-start">
      <!-- Left: Image -->
      <div class="bg-[var(--card-bg)] border border-[var(--border-color)] p-8 rounded-2xl shadow-xl md:sticky md:top-24">
        <img
          :src="product.thumbnail"
          :alt="product.title"
          class="w-full h-auto object-contain max-h-[500px] hover:scale-110 transition-transform duration-700"
        />
        
        <!-- Small Images Mockup -->
        <div class="flex gap-4 mt-8 justify-center opacity-40">
           <div v-for="i in 3" :key="i" class="w-16 h-16 border-2 border-[var(--border-color)] p-1 bg-white dark:bg-slate-800 rounded-xl cursor-not-allowed hover:border-[var(--accent-color)] transition-all">
              <img :src="product.thumbnail" class="w-full h-full object-contain" />
           </div>
        </div>
      </div>

      <!-- Right: Details -->
      <div class="space-y-6">
        <div class="bg-[var(--card-bg)] border border-[var(--border-color)] p-8 rounded-2xl shadow-xl">
          <h1 class="text-3xl md:text-5xl font-black text-[var(--text-color)] mb-4 tracking-tighter leading-none">
            {{ language.translateDynamic(product.title) }}
          </h1>
          
          <div class="flex items-center gap-4 mb-8">
             <div class="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full border border-amber-200">
                <span class="text-amber-500 font-black">★</span>
                <span class="text-sm font-black text-amber-700 dark:text-amber-400">{{ product.rating }}</span>
             </div>
             <div class="h-4 w-px bg-[var(--border-color)]"></div>
             <span class="text-[10px] font-black text-[var(--accent-color)] uppercase tracking-widest bg-[var(--accent-color)]/10 px-3 py-1 rounded-full border border-[var(--accent-color)]/20 shadow-sm">{{ language.translateDynamic('Verified Seller') }}</span>
          </div>

          <div class="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-[var(--border-color)] mb-8">
             <div class="flex items-center gap-4">
                <span class="text-5xl font-black text-[var(--promo-color)] tracking-tighter">{{ currency.format(product.price) }}</span>
                <div v-if="product.discountPercentage" class="flex flex-col">
                  <span class="text-lg text-[var(--text-muted)] line-through opacity-50 font-bold">{{ currency.format(product.price * (1 + product.discountPercentage / 100)) }}</span>
                  <span class="text-xs text-white bg-[var(--promo-color)] px-2 py-0.5 font-black rounded w-fit">{{ language.translateDynamic('SAVE') }} {{ Math.round(product.discountPercentage) }}%</span>
                </div>
             </div>
             <p class="text-[10px] text-[var(--text-muted)] font-black mt-3 uppercase tracking-[0.2em]">{{ language.translateDynamic('Limited duration offer. Price includes VAT.') }}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <button
               @click="addToCart"
               class="bg-[var(--accent-color)] hover:bg-[#1D4ED8] text-white py-5 font-black rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-widest text-sm flex items-center justify-center gap-3"
             >
               <span class="text-xl">🛒</span>
               {{ language.t.addToCart }}
             </button>
             <button @click="buyNow" class="bg-[var(--cta-color)] hover:bg-[var(--cta-hover)] text-white py-5 font-black rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-widest text-sm flex items-center justify-center gap-3">
               <span class="text-xl animate-pulse">⚡</span>
               {{ language.translateDynamic('Buy Now') }}
             </button>
          </div>
        </div>

        <!-- Description Box -->
        <div class="bg-[var(--card-bg)] border border-[var(--border-color)] p-8 rounded-sm shadow-sm">
           <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 uppercase mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">{{ language.translateDynamic('Description') }}</h3>
           <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
             {{ language.translateDynamic(product.description) }}
           </p>
           
           <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
              <div class="space-y-1">
                 <span class="text-[10px] text-gray-400 font-bold uppercase">{{ language.translateDynamic('Condition') }}</span>
                 <p class="text-sm font-bold text-gray-700 dark:text-gray-300">{{ language.translateDynamic('Brand New') }}</p>
              </div>
              <div class="space-y-1">
                 <span class="text-[10px] text-gray-400 font-bold uppercase">{{ language.translateDynamic('Warranty') }}</span>
                 <p class="text-sm font-bold text-gray-700 dark:text-gray-300">{{ language.translateDynamic('Standard Manufacturer') }}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>
