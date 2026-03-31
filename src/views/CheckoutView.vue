<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useCurrencyStore } from '../stores/currency'
import NavBar from '../components/NavBar.vue'

const cart = useCartStore()
const router = useRouter()
const currency = useCurrencyStore()

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
const tax = computed(() => (subtotal.value * 0.1))
const total = computed(() => (subtotal.value + tax.value))

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
  alert(`Thank you, ${name.value}! Your order of ${currency.format(total.value)} has been placed via ${paymentMethod.value}.`)
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
        class="mb-8 flex items-center gap-2 text-[var(--accent-color)] hover:text-blue-800 dark:hover:text-blue-300 font-bold transition-all hover:gap-4 uppercase tracking-widest text-xs"
      >
        ← Back to Store
      </button>

      <h1 class="text-3xl md:text-5xl font-black text-[var(--text-color)] mb-8 md:mb-12 tracking-tighter">Secure Checkout</h1>

      <div class="grid md:grid-cols-2 gap-8">
        <!-- form -->
        <div class="space-y-6">
          <!-- Step Indicator -->
          <div class="flex items-center gap-4 mb-10">
            <div :class="['flex items-center justify-center w-10 h-10 rounded-xl font-black transition-all shadow-md', currentStep >= 1 ? 'bg-[var(--accent-color)] text-white scale-110' : 'bg-gray-200 dark:bg-gray-700 text-gray-500']">1</div>
            <div class="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div :class="['h-full bg-[var(--accent-color)] rounded-full transition-all duration-700 ease-out', currentStep > 1 ? 'w-full' : 'w-0']"></div>
            </div>
            <div :class="['flex items-center justify-center w-10 h-10 rounded-xl font-black transition-all shadow-md', currentStep >= 2 ? 'bg-[var(--accent-color)] text-white scale-110' : 'bg-gray-200 dark:bg-gray-700 text-gray-500']">2</div>
          </div>

          <!-- Step 1: Shipping -->
          <div v-if="currentStep === 1" class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">Shipping Details</h2>
            <div>
              <label class="block text-xs font-black uppercase text-[var(--text-muted)] mb-2 tracking-widest">Full Name</label>
              <input v-model="name" type="text" class="w-full px-5 py-3 border-2 border-[var(--border-color)] bg-[var(--card-bg)] rounded-xl focus:outline-none focus:border-[var(--accent-color)] transition-all shadow-inner" placeholder="John Doe" required />
            </div>
            <div>
              <label class="block text-xs font-black uppercase text-[var(--text-muted)] mb-2 tracking-widest">Shipping Address</label>
              <input v-model="address" type="text" class="w-full px-5 py-3 border-2 border-[var(--border-color)] bg-[var(--card-bg)] rounded-xl focus:outline-none focus:border-[var(--accent-color)] transition-all shadow-inner" placeholder="123 Street Name" required />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-black uppercase text-[var(--text-muted)] mb-2 tracking-widest">City</label>
                <input v-model="city" type="text" class="w-full px-5 py-3 border-2 border-[var(--border-color)] bg-[var(--card-bg)] rounded-xl focus:outline-none focus:border-[var(--accent-color)] transition-all shadow-inner" placeholder="Colombo" />
              </div>
              <div>
                <label class="block text-xs font-black uppercase text-[var(--text-muted)] mb-2 tracking-widest">Zip Code</label>
                <input v-model="postal" type="text" class="w-full px-5 py-3 border-2 border-[var(--border-color)] bg-[var(--card-bg)] rounded-xl focus:outline-none focus:border-[var(--accent-color)] transition-all shadow-inner" placeholder="10115" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-black uppercase text-[var(--text-muted)] mb-2 tracking-widest">Country</label>
              <select v-model="country" class="w-full px-5 py-3 border-2 border-[var(--border-color)] bg-[var(--card-bg)] rounded-xl focus:outline-none focus:border-[var(--accent-color)] transition-all bg-[var(--card-bg)] text-[var(--text-color)] shadow-inner font-bold" required>
                <option value="" disabled>Select your country</option>
                <option v-for="c in countries" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
            <button
              @click="nextStep"
              class="w-full bg-[var(--accent-color)] text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-[var(--accent-color)]/20 transition-all hover:bg-[#1D4ED8] hover:scale-[1.02] active:scale-[0.98]"
            >
              Secure Payment 🔒
            </button>
          </div>

          <!-- Step 2: Payment -->
          <div v-if="currentStep === 2" class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">Payment Method</h2>
            <div class="grid gap-4">
              <label class="flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-500 shadow-sm" 
                :class="paymentMethod === 'credit-card' ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/5 ring-2 ring-[var(--accent-color)]/20 shadow-lg' : 'border-[var(--border-color)] bg-[var(--card-bg)] hover:border-[var(--accent-color)]/50'">
                <input type="radio" v-model="paymentMethod" value="credit-card" class="w-5 h-5 accent-[var(--accent-color)]" />
                <div class="flex-1">
                  <div class="font-black text-[var(--text-color)] uppercase tracking-tight">Credit Card</div>
                  <div class="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Safe & Secure Payment</div>
                </div>
                <div class="text-3xl">💳</div>
              </label>
              
              <label class="flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-500 shadow-sm" 
                :class="paymentMethod === 'paypal' ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/5 ring-2 ring-[var(--accent-color)]/20 shadow-lg' : 'border-[var(--border-color)] bg-[var(--card-bg)] hover:border-[var(--accent-color)]/50'">
                <input type="radio" v-model="paymentMethod" value="paypal" class="w-5 h-5 accent-[var(--accent-color)]" />
                <div class="flex-1">
                  <div class="font-black text-[var(--text-color)] uppercase tracking-tight">PayPal</div>
                  <div class="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">One-click experience</div>
                </div>
                <div class="text-3xl">🌍</div>
              </label>
 
              <label class="flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-500 shadow-sm" 
                :class="paymentMethod === 'cod' ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/5 ring-2 ring-[var(--accent-color)]/20 shadow-lg' : 'border-[var(--border-color)] bg-[var(--card-bg)] hover:border-[var(--accent-color)]/50'">
                <input type="radio" v-model="paymentMethod" value="cod" class="w-5 h-5 accent-[var(--accent-color)]" />
                <div class="flex-1">
                  <div class="font-black text-[var(--text-color)] uppercase tracking-tight">Cash on Delivery</div>
                  <div class="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Pay at your doorstep</div>
                </div>
                <div class="text-3xl">💵</div>
              </label>
            </div>
            
            <div class="flex gap-4 pt-6">
              <button
                @click="prevStep"
                class="flex-1 border-2 border-[var(--border-color)] text-[var(--text-muted)] py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 dark:hover:bg-gray-800 transition-all shadow-sm"
              >
                Back
              </button>
              <button
                @click="placeOrder"
                class="flex-[2] bg-[var(--cta-color)] hover:bg-[var(--cta-hover)] text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all duration-500 shadow-2xl shadow-[var(--cta-color)]/40 hover:scale-[1.05] active:scale-95"
              >
                Complete Payment ({{ currency.format(total) }})
              </button>
            </div>
          </div>
        </div>

        <!-- summary -->
        <div class="bg-[var(--card-bg)] rounded-2xl shadow-2xl p-8 border border-[var(--border-color)] relative h-fit">
          <div class="absolute top-0 left-0 w-full h-1 bg-[var(--accent-color)]"></div>
          <h2 class="text-xs font-black text-[var(--text-muted)] mb-8 uppercase tracking-[0.2em]">Purchase Details</h2>
          <ul class="space-y-6">
            <li v-for="item in selectedItems" :key="item.id" class="flex justify-between items-center gap-4">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 bg-white p-1 rounded-lg border border-[var(--border-color)] shrink-0">
                  <img :src="item.thumbnail" class="w-full h-full object-contain" />
                </div>
                <span class="text-xs font-bold text-[var(--text-color)] truncate uppercase tracking-tighter">{{ item.title }}</span>
              </div>
              <span class="text-sm font-black text-[var(--promo-color)] shrink-0">{{ currency.format(item.price) }}</span>
            </li>
          </ul>
          <div class="mt-8 border-t border-[var(--border-color)] pt-6 space-y-4">
            <div class="flex justify-between text-xs font-bold uppercase text-[var(--text-muted)]">
              <span>Subtotal</span>
              <span class="text-[var(--text-color)]">{{ currency.format(subtotal) }}</span>
            </div>
            <div class="flex justify-between text-xs font-bold uppercase text-[var(--text-muted)]">
              <span>Service Tax</span>
              <span class="text-[var(--text-color)]">{{ currency.format(tax) }}</span>
            </div>
            <div class="h-1 bg-dashed border-t-2 border-dashed border-[var(--border-color)] my-2"></div>
            <div class="flex justify-between font-black text-2xl tracking-tighter text-[var(--promo-color)]">
              <span class="uppercase text-xs self-center text-[var(--text-color)] tracking-widest">Total Pay</span>
              <span>{{ currency.format(total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
