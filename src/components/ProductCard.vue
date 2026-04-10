<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useCurrencyStore } from '../stores/currency'
import { useLanguageStore } from '../stores/language'
import type { Product } from '../types/Product'

const props = defineProps<{
  product: Product
}>()

const router = useRouter()
const cart = useCartStore()
const currency = useCurrencyStore()
const language = useLanguageStore()

const goToDetail = () => {
  router.push(`/product/${props.product.id}`)
}
</script>

<template>
  <div
    class="group bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer flex flex-col h-full"
    @click="goToDetail"
  >
    <!-- Image -->
    <div class="aspect-square bg-white dark:bg-slate-800 flex items-center justify-center p-4 overflow-hidden relative">
      <img
        :src="product.thumbnail"
        class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
        :alt="product.title"
        loading="lazy"
      />
      <!-- Discount badge -->
      <div
        v-if="product.discountPercentage && product.discountPercentage >= 5"
        class="absolute top-2 right-2 bg-[var(--promo-color)] text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg"
      >
        -{{ Math.round(product.discountPercentage) }}%
      </div>
      <!-- Quick view on hover -->
      <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <span class="text-white text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
          Quick View
        </span>
      </div>
    </div>

    <!-- Info -->
    <div class="p-4 flex flex-col flex-grow">
      <!-- Rating bar -->
      <div class="flex items-center gap-1.5 mb-2">
        <div class="flex gap-0.5">
          <span v-for="s in 5" :key="s" class="text-[10px]" :class="s <= Math.round(product.rating || 0) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'">★</span>
        </div>
        <span class="text-[9px] text-[var(--text-muted)] font-bold">{{ product.rating?.toFixed(1) }}</span>
      </div>

      <h4 class="text-sm font-bold text-[var(--text-color)] line-clamp-2 min-h-[40px] mb-3 group-hover:text-[var(--accent-color)] transition-colors leading-snug">
        {{ language.translateDynamic(product.title) }}
      </h4>

      <div class="mt-auto space-y-3">
        <div class="flex items-end justify-between">
          <div class="flex flex-col">
            <span class="text-xl font-black text-[var(--promo-color)] tracking-tight">{{ currency.format(product.price) }}</span>
            <span v-if="product.discountPercentage && product.discountPercentage >= 5" class="text-[10px] text-[var(--text-muted)] line-through">
              {{ currency.format(product.price / (1 - product.discountPercentage / 100)) }}
            </span>
          </div>
          <span class="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">{{ language.t.rating }}</span>
        </div>

        <button
          @click.stop="cart.add(product)"
          class="w-full py-3 bg-[var(--cta-color)] hover:bg-[var(--cta-hover)] text-white text-xs font-black rounded-xl transition-all uppercase tracking-widest shadow-lg hover:shadow-[var(--cta-color)]/30 transform active:scale-95 flex items-center justify-center gap-2"
        >
          <span>🛒</span>
          {{ language.t.addToCart }}
        </button>
      </div>
    </div>
  </div>
</template>
