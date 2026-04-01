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
      />
      <div v-if="product.discountPercentage" class="absolute top-3 right-3 bg-[var(--promo-color)] text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">
        -{{ Math.round(product.discountPercentage) }}%
      </div>
    </div>

    <!-- Info -->
    <div class="p-5 flex flex-col flex-grow bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
      <h4 class="text-sm font-bold text-[var(--text-color)] line-clamp-2 min-h-[40px] mb-2 group-hover:text-[var(--accent-color)] transition-colors">
        {{ language.translateDynamic(product.title) }}
      </h4>
      
      <div class="mt-auto space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex flex-col">
            <span class="text-xl font-black text-[var(--promo-color)] tracking-tight">{{ currency.format(product.price) }}</span>
            <div class="flex items-center gap-1 mt-0.5">
              <span class="text-amber-400 text-xs text-shadow-sm">★</span>
              <span class="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-tighter">{{ product.rating?.toFixed(1) }} {{ language.t.rating }}</span>
            </div>
          </div>
        </div>

        <button 
          @click.stop="cart.add(product)"
          class="w-full py-3 bg-[var(--cta-color)] hover:bg-[var(--cta-hover)] text-white text-xs font-black rounded-xl transition-all uppercase tracking-widest shadow-lg hover:shadow-[var(--cta-color)]/20 transform active:scale-95"
        >
          {{ language.t.addToCart }}
        </button>
      </div>
    </div>
  </div>
</template>
