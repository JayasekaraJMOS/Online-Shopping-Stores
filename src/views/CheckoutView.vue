<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import NavBar from '../components/NavBar.vue'

const cart = useCartStore()
const router = useRouter()

const name = ref('')
const address = ref('')
const city = ref('')
const postal = ref('')
const country = ref('')

const selectedItems = computed(() => cart.items.filter(i => cart.selectedIds.has(i.id)))
const subtotal = computed(() => selectedItems.value.reduce((s, i) => s + i.price, 0))
const tax = computed(() => +(subtotal.value * 0.1).toFixed(2))
const total = computed(() => +(subtotal.value + tax.value).toFixed(2))

const placeOrder = () => {
  if (!name.value || !address.value) {
    alert('Please fill out your name and address')
    return
  }
  alert(`Thank you, ${name.value}! Your order of $${total.value} has been placed.`)
  cart.clear()
  router.push('/')
}
</script>

<template>
  <NavBar />

  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-850 transition-colors duration-300 py-12 px-6">
    <div class="max-w-4xl mx-auto">
      <button
        @click="router.back()"
        class="mb-8 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold transition-all hover:gap-4"
      >
        ← Back
      </button>

      <h1 class="text-4xl font-black text-gray-900 dark:text-white mb-8">Checkout</h1>

      <div class="grid md:grid-cols-2 gap-8">
        <!-- form -->
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1">Name</label>
            <input v-model="name" type="text" class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition" required />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1">Address</label>
            <input v-model="address" type="text" class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition" required />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1">City</label>
              <input v-model="city" type="text" class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition" />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1">Postal Code</label>
              <input v-model="postal" type="text" class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1">Country</label>
            <input v-model="country" type="text" class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition" />
          </div>
          <button
            @click="placeOrder"
            class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 text-white py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            Place Order (${{ total }})
          </button>
        </div>

        <!-- summary -->
        <div class="bg-white dark:bg-gray-700 rounded-2xl shadow-xl p-8">
          <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-4">Order Summary</h2>
          <ul class="space-y-4">
            <li v-for="item in selectedItems" :key="item.id" class="flex justify-between">
              <span>{{ item.title }}</span>
              <span>${{ item.price.toFixed(2) }}</span>
            </li>
          </ul>
          <div class="mt-6 border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Tax (10%)</span>
              <span>${{ tax.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between font-black text-lg">
              <span>Total</span>
              <span>${{ total.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
