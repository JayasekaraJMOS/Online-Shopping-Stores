<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import NavBar from '../components/NavBar.vue'

const router = useRouter()
const cart = useCartStore()

const selectedTotal = computed(() => {
  return cart.items
    .filter(item => cart.selectedIds.has(item.id))
    .reduce((sum, item) => sum + item.price, 0)
    .toFixed(2)
})

const goBack = () => {
  router.back()
}

const removeItem = (id: number) => {
  cart.remove(id)
}

const clearCart = () => {
  if (confirm('Are you sure you want to clear your cart?')) {
    cart.clear()
  }
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
      <div class="mb-6 flex items-center gap-2 text-xs text-[var(--text-muted)] font-bold uppercase">
        <button @click="goBack" class="hover:text-[#ff6600]">Home</button>
        <span>/</span>
        <span class="text-[var(--text-color)]">Shopping Cart</span>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Left Side: Items -->
        <div class="lg:col-span-2 space-y-4">
          <div v-if="cart.items.length === 0" class="bg-[var(--card-bg)] border border-[var(--border-color)] p-12 text-center rounded-sm">
            <p class="text-[var(--text-muted)] font-bold uppercase mb-6">Your cart is empty</p>
            <button
              @click="router.push('/')"
              class="bg-[#ff6600] text-white px-8 py-3 rounded-sm font-bold uppercase text-xs hover:bg-[#e65c00] transition"
            >
              Continue Shopping
            </button>
          </div>

          <div v-else class="space-y-4">
            <!-- Select All -->
            <div class="bg-[var(--card-bg)] border border-[var(--border-color)] p-4 flex justify-between items-center rounded-sm">
              <div class="flex items-center gap-4">
                 <span class="text-sm font-bold uppercase text-[var(--text-muted)]">
                   Selected ({{ cart.selectedCount }})
                 </span>
              </div>
              <div class="flex gap-2 text-[10px] font-bold uppercase">
                <button @click="cart.selectAll" class="text-[#ff6600] hover:underline">Select All</button>
                <span class="text-[var(--border-color)]">|</span>
                <button @click="cart.deselectAll" class="text-[var(--text-muted)] hover:underline">Deselect All</button>
                <span class="text-[var(--border-color)]">|</span>
                <button @click="clearCart" class="text-red-500 hover:underline">Clear All</button>
              </div>
            </div>

            <!-- Items List -->
            <div 
              v-for="item in cart.items" 
              :key="item.id"
              class="bg-[var(--card-bg)] border border-[var(--border-color)] p-4 flex gap-4 rounded-sm relative group"
            >
              <div class="flex items-center">
                <input
                  type="checkbox"
                  :checked="cart.selectedIds.has(item.id)"
                  @change="cart.toggleSelected(item.id)"
                  class="w-4 h-4 accent-[#ff6600] cursor-pointer"
                />
              </div>
              <div class="w-20 h-20 bg-white p-2 rounded-sm border border-[var(--border-color)] shrink-0 flex items-center justify-center">
                <img :src="item.thumbnail" class="max-w-full max-h-full object-contain" />
              </div>
              <div class="flex-grow min-w-0">
                <h3 class="font-bold text-sm truncate uppercase mb-1">{{ item.title }}</h3>
                <p class="text-[10px] text-[var(--text-muted)] line-clamp-1 mb-2">{{ item.description }}</p>
                <div class="flex items-center justify-between">
                  <span class="text-[#ff6600] font-bold text-lg">${{ item.price }}</span>
                  <button @click="removeItem(item.id)" class="text-[10px] font-bold text-[var(--text-muted)] hover:text-red-600 uppercase">Remove</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Summary -->
        <div class="lg:col-span-1">
          <div class="bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-sm sticky top-24 shadow-sm">
            <h2 class="text-sm font-bold uppercase border-b border-[var(--border-color)] pb-4 mb-4">Order Summary</h2>
            
            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-xs">
                <span class="text-[var(--text-muted)]">Subtotal</span>
                <span class="font-bold">${{ selectedTotal }}</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-[var(--text-muted)]">Shipping</span>
                <span class="text-green-600 font-bold uppercase">Free</span>
              </div>
            </div>

            <div class="border-t border-[var(--border-color)] pt-4 mb-6">
              <div class="flex justify-between items-end">
                <span class="text-xs font-bold uppercase">Total</span>
                <div class="text-right">
                  <p class="text-2xl font-bold text-[#ff6600] leading-none">${{ selectedTotal }}</p>
                  <p class="text-[10px] text-[var(--text-muted)] mt-1 italic">VAT included where applicable</p>
                </div>
              </div>
            </div>

            <button
              @click="checkout"
              :disabled="cart.selectedCount === 0"
              class="w-full bg-[#ff6600] text-white py-4 rounded-sm font-bold uppercase text-xs hover:bg-[#e65c00] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
