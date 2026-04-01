<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useCurrencyStore } from '../stores/currency'
import { useLanguageStore } from '../stores/language'
import NavBar from '../components/NavBar.vue'

const router = useRouter()
const cart = useCartStore()
const currency = useCurrencyStore()
const language = useLanguageStore()

const selectedTotal = computed(() => {
  return cart.items
    .filter(item => cart.selectedIds.has(item.id))
    .reduce((sum, item) => sum + item.price, 0)
})

const goBack = () => {
  router.back()
}

const removeItem = (id: number) => {
  cart.remove(id)
}

const showClearConfirm = ref(false)

const handleClearCart = () => {
  showClearConfirm.value = true
}

const cancelClear = () => {
  showClearConfirm.value = false
}

const confirmClear = () => {
  cart.clear()
  showClearConfirm.value = false
}

const checkout = () => {
  if (cart.selectedCount === 0) {
    alert('Please select at least one item to checkout')
    return
  }
  router.push('/checkout')
}
</script>

<template>
  <NavBar />

  <div class="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-500 py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Breadcrumbs -->
      <div class="mb-4 md:mb-6 flex items-center gap-2 text-[10px] md:text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest">
        <button @click="goBack" class="hover:text-[var(--accent-color)] transition-colors">{{ language.t.home }}</button>
        <span class="opacity-30">/</span>
        <span class="text-[var(--text-color)]">{{ language.translateDynamic('Shopping Cart') }}</span>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Left Side: Items -->
        <div class="lg:col-span-2 space-y-4">
          <div v-if="cart.items.length === 0" class="bg-[var(--card-bg)] border border-[var(--border-color)] p-10 md:p-16 text-center rounded-2xl shadow-xl">
            <div class="text-4xl md:text-6xl mb-6 opacity-20">🛒</div>
            <p class="text-[var(--text-muted)] font-black uppercase mb-8 tracking-widest text-xs md:text-sm">{{ language.translateDynamic('Your cart is empty') }}</p>
            <button
              @click="router.push('/')"
              class="bg-[var(--accent-color)] text-white px-8 md:px-10 py-3 md:py-4 rounded-xl font-black uppercase text-[10px] md:text-xs hover:bg-[#1D4ED8] transition-all shadow-lg active:scale-95"
            >
              {{ language.translateDynamic('Start Shopping') }}
            </button>
          </div>

          <div v-else class="space-y-4">
            <!-- Select All -->
            <div class="bg-[var(--card-bg)] border border-[var(--border-color)] p-5 flex justify-between items-center rounded-2xl shadow-md">
              <div class="flex items-center gap-4">
                 <span class="text-xs font-black uppercase text-[var(--text-color)] tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-[var(--border-color)]">
                   {{ language.translateDynamic('Selected') }} ({{ cart.selectedCount }})
                 </span>
              </div>
              <div class="flex gap-3 text-[10px] font-black uppercase tracking-tighter">
                <button @click="cart.selectAll" class="text-[var(--accent-color)] hover:underline">{{ language.translateDynamic('Select All') }}</button>
                <span class="text-[var(--border-color)]">|</span>
                <button @click="cart.deselectAll" class="text-[var(--text-muted)] hover:underline">{{ language.translateDynamic('Deselect All') }}</button>
                <span class="text-[var(--border-color)]">|</span>
                <button v-if="!showClearConfirm" @click="handleClearCart" class="text-red-500 hover:underline">{{ language.translateDynamic('Clear All') }}</button>
                <div v-else class="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-xl border border-red-100 dark:border-red-900/40 shadow-sm animate-fade-in">
                  <span class="text-red-600 dark:text-red-400 font-black">Clear?</span>
                  <button @click="confirmClear" class="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition font-black">YES</button>
                  <button @click="cancelClear" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-black">NO</button>
                </div>
              </div>
            </div>

            <!-- Items List -->
            <div 
              v-for="item in cart.items" 
              :key="item.id"
              class="bg-[var(--card-bg)] border border-[var(--border-color)] p-3 md:p-4 flex gap-3 md:gap-4 rounded-xl relative group shadow-sm transition-all hover:shadow-md"
            >
              <div class="flex items-center">
                <input
                  type="checkbox"
                  :checked="cart.selectedIds.has(item.id)"
                  @change="cart.toggleSelected(item.id)"
                  class="w-5 h-5 accent-[var(--accent-color)] cursor-pointer"
                />
              </div>
              <div class="w-20 h-20 md:w-24 md:h-24 bg-white p-2 md:p-3 rounded-xl border border-[var(--border-color)] shrink-0 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                <img :src="item.thumbnail" class="max-w-full max-h-full object-contain" />
              </div>
              <div class="flex-grow min-w-0 flex flex-col justify-center">
                <h3 class="font-black text-xs md:text-sm truncate uppercase mb-1 text-[var(--text-color)] tracking-tight">{{ language.translateDynamic(item.title) }}</h3>
                <p class="text-[9px] md:text-[10px] text-[var(--text-muted)] line-clamp-1 mb-2 md:mb-3 tracking-tighter">{{ language.translateDynamic(item.description) }}</p>
                <div class="flex items-center justify-between mt-auto">
                  <span class="text-[var(--promo-color)] font-black text-base md:text-xl tracking-tighter">{{ currency.format(item.price) }}</span>
                  <button @click="removeItem(item.id)" class="text-[9px] font-black text-[var(--text-muted)] hover:text-red-600 uppercase tracking-widest flex items-center gap-1 transition-colors">
                    <span>🗑️</span> <span class="hidden sm:inline">{{ language.translateDynamic('Remove') }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Summary -->
        <div class="lg:col-span-1">
          <div class="bg-[var(--card-bg)] border border-[var(--border-color)] p-8 rounded-2xl sticky top-24 shadow-2xl overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--accent-color)] via-[var(--promo-color)] to-[var(--cta-color)]"></div>
            <h2 class="text-xs font-black uppercase border-b border-[var(--border-color)] pb-4 mb-6 tracking-[0.2em] text-[var(--text-muted)]">{{ language.translateDynamic('Order Summary') }}</h2>
            
            <div class="space-y-4 mb-8">
              <div class="flex justify-between text-xs font-bold">
                <span class="text-[var(--text-muted)]">{{ language.translateDynamic('Subtotal') }}</span>
                <span>{{ currency.format(selectedTotal) }}</span>
              </div>
              <div class="flex justify-between text-xs font-bold">
                <span class="text-[var(--text-muted)]">{{ language.translateDynamic('Shipping') }}</span>
                <span class="text-[var(--cta-color)] uppercase flex items-center gap-1">
                  <span>🚚</span> {{ language.translateDynamic('Free') }}
                </span>
              </div>
            </div>

            <div class="border-t border-[var(--border-color)] pt-6 mb-8">
              <div class="flex justify-between items-end">
                <span class="text-[10px] md:text-xs font-black uppercase tracking-widest opacity-60">{{ language.translateDynamic('Total Pay') }}</span>
                <div class="text-right">
                  <p class="text-3xl md:text-4xl font-black text-[var(--promo-color)] leading-none tracking-tighter">{{ currency.format(selectedTotal) }}</p>
                  <p class="text-[9px] md:text-[10px] text-[var(--text-muted)] mt-2 italic font-medium uppercase tracking-tighter">{{ language.translateDynamic('VAT included where applicable') }}</p>
                </div>
              </div>
            </div>

            <button
              @click="checkout"
              :disabled="cart.selectedCount === 0"
              class="group/cta w-full bg-[var(--cta-color)] hover:bg-[var(--cta-hover)] text-white py-5 rounded-xl font-black uppercase text-sm tracking-[0.1em] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[var(--cta-color)]/20 active:scale-95 flex items-center justify-center gap-3"
            >
              {{ language.translateDynamic('Checkout Now') }}
              <span class="text-xl group-hover/cta:translate-x-1 transition-transform">→</span>
            </button>
            <p v-if="cart.selectedCount === 0" class="text-[10px] text-red-500 font-bold text-center mt-3 uppercase tracking-tighter">{{ language.translateDynamic('Please select items to proceed') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
