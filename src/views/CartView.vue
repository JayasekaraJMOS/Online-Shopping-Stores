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

  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-850 transition-colors duration-300 py-12 px-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <button
        @click="goBack"
        class="mb-8 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold transition-all hover:gap-4"
      >
        ← Back
      </button>

      <h1 class="text-5xl font-black text-gray-900 dark:text-white mb-8">Shopping Cart</h1>

      <!-- Empty Cart -->
      <div v-if="cart.items.length === 0" class="text-center py-32 bg-white dark:bg-gray-700 rounded-2xl shadow-xl p-12">
        <div class="text-8xl mb-6 animate-bounce">🛒</div>
        <p class="text-gray-700 dark:text-gray-200 text-2xl font-bold mb-8">Your cart is empty</p>
        <button
          @click="() => router.push('/')"
          class="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 text-white px-8 py-4 rounded-xl font-black text-lg hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-800 dark:hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        >
          Continue Shopping
        </button>
      </div>

      <!-- Cart Items -->
      <div v-else class="space-y-6">
        <!-- Select All Controls -->
        <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-xl p-4 flex justify-between items-center">
          <span class="font-black text-gray-900 dark:text-white">
            Selected: {{ cart.selectedCount }}/{{ cart.count }} items
          </span>
          <div class="flex gap-3">
            <button
              @click="cart.selectAll"
              class="px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg font-bold hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-all duration-200"
            >
              Select All
            </button>
            <button
              @click="cart.deselectAll"
              class="px-4 py-2 bg-orange-600 dark:bg-orange-700 text-white rounded-lg font-bold hover:bg-orange-700 dark:hover:bg-orange-800 transition-all duration-200"
            >
              Deselect All
            </button>
          </div>
        </div>

        <!-- Items List -->
        <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-xl overflow-hidden">
          <div class="divide-y dark:divide-gray-600">
            <div
              v-for="item in cart.items"
              :key="item.id"
              class="p-6 flex gap-6 hover:bg-indigo-50 dark:hover:bg-gray-600 transition-colors duration-200 items-start"
            >
              <!-- Checkbox -->
              <div class="flex items-center pt-4">
                <input
                  type="checkbox"
                  :checked="cart.selectedIds.has(item.id)"
                  @change="cart.toggleSelected(item.id)"
                  class="w-5 h-5 rounded accent-indigo-600 dark:accent-indigo-400 cursor-pointer"
                />
              </div>

              <!-- Image -->
              <div class="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded-xl p-4 flex-shrink-0 hidden sm:flex items-center justify-center w-28 h-28">
                <img
                  :src="item.thumbnail"
                  :alt="item.title"
                  class="max-w-full max-h-full object-contain"
                />
              </div>

              <!-- Details -->
              <div class="flex-grow">
                <h3 class="font-black text-lg text-gray-900 dark:text-white mb-2">{{ item.title }}</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{{ item.description }}</p>
                <div class="flex justify-between items-center">
                  <p class="text-3xl font-black text-green-600 dark:text-green-400">${{ item.price }}</p>
                  <button
                    @click="removeItem(item.id)"
                    class="px-6 py-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-black transition-colors duration-200 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                  >
                    ✕ Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Summary Card -->
          <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-xl p-8">
            <h2 class="text-3xl font-black text-gray-900 dark:text-white mb-6">Order Summary</h2>
            <div class="space-y-4 mb-6 pb-6 border-b-2 border-gray-200 dark:border-gray-600">
              <div class="flex justify-between text-lg">
                <span class="font-semibold text-gray-700 dark:text-gray-300">Subtotal:</span>
                <span class="font-black text-gray-900 dark:text-white">${{ selectedTotal }}</span>
              </div>
              <div class="flex justify-between text-lg">
                <span class="font-semibold text-gray-700 dark:text-gray-300">Shipping:</span>
                <span class="font-black text-green-600 dark:text-green-400">FREE</span>
              </div>
              <div class="flex justify-between text-lg">
                <span class="font-semibold text-gray-700 dark:text-gray-300">Tax (10%):</span>
                <span class="font-black text-gray-900 dark:text-white">${{ (parseFloat(selectedTotal) * 0.1).toFixed(2) }}</span>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-2xl font-black text-gray-900 dark:text-white">Total:</span>
              <span class="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">${{ (parseFloat(selectedTotal) * 1.1).toFixed(2) }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="space-y-3 flex flex-col">
            <button
              @click="checkout"
              :disabled="cart.selectedCount === 0"
              class="flex-grow bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700 text-white py-5 rounded-xl font-black text-lg hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 dark:hover:from-indigo-800 dark:hover:via-purple-800 dark:hover:to-pink-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              💳 Checkout ({{ cart.selectedCount }})
            </button>
            <button
              @click="clearCart"
              class="bg-red-600 dark:bg-red-700 text-white py-3 rounded-xl font-black hover:bg-red-700 dark:hover:bg-red-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              🗑️ Clear Cart
            </button>
            <button
              @click="() => router.push('/')"
              class="bg-gray-600 dark:bg-gray-600 text-white py-3 rounded-xl font-black hover:bg-gray-700 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              ← Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
