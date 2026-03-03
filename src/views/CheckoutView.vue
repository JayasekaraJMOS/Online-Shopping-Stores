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
const paymentMethod = ref('credit-card')
const currentStep = ref(1)

const countries = [
  'Sri Lanka',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'India',
  'Germany',
  'France',
  'Japan',
  'China'
]

const selectedItems = computed(() => cart.items.filter(i => cart.selectedIds.has(i.id)))
const subtotal = computed(() => selectedItems.value.reduce((s, i) => s + i.price, 0))
const tax = computed(() => +(subtotal.value * 0.1).toFixed(2))
const total = computed(() => +(subtotal.value + tax.value).toFixed(2))

const nextStep = () => {
  if (currentStep.value === 1) {
    if (!name.value || !address.value || !city.value || !postal.value || !country.value) {
      alert('Please fill out all shipping details')
      return
    }
  }
  currentStep.value++
}

const prevStep = () => {
  currentStep.value--
}

const placeOrder = () => {
  if (!paymentMethod.value) {
    alert('Please select a payment method')
    return
  }
  alert(`Thank you, ${name.value}! Your order of $${total.value} has been placed via ${paymentMethod.value}.`)
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
          <!-- Step Indicator -->
          <div class="flex items-center gap-4 mb-8">
            <div :class="['flex items-center justify-center w-8 h-8 rounded-full font-bold transition-colors', currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500']">1</div>
            <div class="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div :class="['h-full bg-indigo-600 rounded-full transition-all duration-500', currentStep > 1 ? 'w-full' : 'w-0']"></div>
            </div>
            <div :class="['flex items-center justify-center w-8 h-8 rounded-full font-bold transition-colors', currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500']">2</div>
          </div>

          <!-- Step 1: Shipping -->
          <div v-if="currentStep === 1" class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">Shipping Details</h2>
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1">Name</label>
              <input v-model="name" type="text" class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition" placeholder="John Doe" required />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1">Address</label>
              <input v-model="address" type="text" class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition" placeholder="123 Street Name" required />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1">City</label>
                <input v-model="city" type="text" class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition" placeholder="Colombo" />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1">Postal Code</label>
                <input v-model="postal" type="text" class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition" placeholder="10115" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1">Country</label>
              <select v-model="country" class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition bg-white dark:bg-gray-800 text-gray-900 dark:text-white" required>
                <option value="" disabled>Select your country</option>
                <option v-for="c in countries" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
            <button
              @click="nextStep"
              class="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Continue to Payment
            </button>
          </div>

          <!-- Step 2: Payment -->
          <div v-if="currentStep === 2" class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">Payment Method</h2>
            <div class="grid gap-4">
              <label class="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300" 
                :class="paymentMethod === 'credit-card' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'">
                <input type="radio" v-model="paymentMethod" value="credit-card" class="w-5 h-5 accent-indigo-600" />
                <div class="flex-1">
                  <div class="font-bold text-gray-900 dark:text-white">Credit Card</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">Pay securely with Visa or Mastercard</div>
                </div>
                <div class="text-2xl">💳</div>
              </label>
              
              <label class="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300" 
                :class="paymentMethod === 'paypal' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'">
                <input type="radio" v-model="paymentMethod" value="paypal" class="w-5 h-5 accent-indigo-600" />
                <div class="flex-1">
                  <div class="font-bold text-gray-900 dark:text-white">PayPal</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">Fast and secure with PayPal account</div>
                </div>
                <div class="text-2xl">🌍</div>
              </label>

              <label class="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300" 
                :class="paymentMethod === 'cod' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'">
                <input type="radio" v-model="paymentMethod" value="cod" class="w-5 h-5 accent-indigo-600" />
                <div class="flex-1">
                  <div class="font-bold text-gray-900 dark:text-white">Cash on Delivery</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">Pay when your order arrives</div>
                </div>
                <div class="text-2xl">💵</div>
              </label>
            </div>
            
            <div class="flex gap-4 pt-4">
              <button
                @click="prevStep"
                class="flex-1 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                Back
              </button>
              <button
                @click="placeOrder"
                class="flex-[2] bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 text-white py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                Place Order (${{ total }})
              </button>
            </div>
          </div>
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
