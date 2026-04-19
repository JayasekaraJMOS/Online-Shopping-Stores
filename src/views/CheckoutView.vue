<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useCurrencyStore } from '../stores/currency'
import { useLanguageStore } from '../stores/language'
import NavBar from '../components/NavBar.vue'

const cart = useCartStore()
const router = useRouter()
const currency = useCurrencyStore()
const language = useLanguageStore()

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

// ─── Buy Now mode: only checkout this one product ───────────────────────────
const isBuyNow = computed(() => !!cart.buyNowItem)

// Items shown in checkout summary
const checkoutItems = computed(() =>
  isBuyNow.value
    ? (cart.buyNowItem ? [cart.buyNowItem] : [])
    : cart.items.filter(i => cart.selectedIds.has(i.id))
)

const subtotal = computed(() => checkoutItems.value.reduce((s, i) => s + i.price, 0))
const tax = computed(() => subtotal.value * 0.1)
// Coupon only applies in normal cart mode
const discount = computed(() => isBuyNow.value ? 0 : cart.couponDiscount)
const total = computed(() => Math.max(0, subtotal.value + tax.value - discount.value))

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
  if (isBuyNow.value) {
    cart.clearBuyNow()   // only clear the express item
  } else {
    cart.clear()         // clear the whole cart
  }
  router.push('/')
}

// Clear buyNowItem if user navigates away without completing
onBeforeUnmount(() => {
  cart.clearBuyNow()
})
</script>

<template>
  <NavBar />

  <div class="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-850 transition-colors duration-300 py-12 px-6">
    <div class="max-w-4xl mx-auto">
      <button
        @click="router.back()"
        class="mb-8 flex items-center gap-2 text-(--accent-color) hover:text-blue-800 dark:hover:text-blue-300 font-bold transition-all hover:gap-4 uppercase tracking-widest text-xs"
      >
        ← {{ language.translateDynamic('Back to Store') }}
      </button>

      <h1 class="text-3xl md:text-5xl font-black text-(--text-color) mb-8 md:mb-12 tracking-tighter">{{ language.translateDynamic('Secure Checkout') }}</h1>

      <div class="grid md:grid-cols-2 gap-8">
        <!-- form -->
        <div class="space-y-6">
          <!-- Step Indicator -->
          <div class="flex items-center gap-4 mb-10">
            <div :class="['flex items-center justify-center w-10 h-10 rounded-xl font-black transition-all shadow-md', currentStep >= 1 ? 'bg-(--accent-color) text-white scale-110' : 'bg-gray-200 dark:bg-gray-700 text-gray-500']">1</div>
            <div class="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div :class="['h-full bg-(--accent-color) rounded-full transition-all duration-700 ease-out', currentStep > 1 ? 'w-full' : 'w-0']"></div>
            </div>
            <div :class="['flex items-center justify-center w-10 h-10 rounded-xl font-black transition-all shadow-md', currentStep >= 2 ? 'bg-(--accent-color) text-white scale-110' : 'bg-gray-200 dark:bg-gray-700 text-gray-500']">2</div>
          </div>

          <!-- Step 1: Shipping -->
          <div v-if="currentStep === 1" class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">{{ language.translateDynamic('Shipping Details') }}</h2>
            <div>
              <label class="block text-xs font-black uppercase text-(--text-muted) mb-2 tracking-widest">{{ language.translateDynamic('Full Name') }}</label>
              <input v-model="name" type="text" class="w-full px-5 py-3 border-2 border-(--border-color) bg-(--card-bg) rounded-xl focus:outline-none focus:border-(--accent-color) transition-all shadow-inner" placeholder="John Doe" required />
            </div>
            <div>
              <label class="block text-xs font-black uppercase text-(--text-muted) mb-2 tracking-widest">{{ language.translateDynamic('Shipping Address') }}</label>
              <input v-model="address" type="text" class="w-full px-5 py-3 border-2 border-(--border-color) bg-(--card-bg) rounded-xl focus:outline-none focus:border-(--accent-color) transition-all shadow-inner" placeholder="123 Street Name" required />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-black uppercase text-(--text-muted) mb-2 tracking-widest">{{ language.translateDynamic('City') }}</label>
                <input v-model="city" type="text" class="w-full px-5 py-3 border-2 border-(--border-color) bg-(--card-bg) rounded-xl focus:outline-none focus:border-(--accent-color) transition-all shadow-inner" placeholder="Colombo" />
              </div>
              <div>
                <label class="block text-xs font-black uppercase text-(--text-muted) mb-2 tracking-widest">{{ language.translateDynamic('Zip Code') }}</label>
                <input v-model="postal" type="text" class="w-full px-5 py-3 border-2 border-(--border-color) bg-(--card-bg) rounded-xl focus:outline-none focus:border-(--accent-color) transition-all shadow-inner" placeholder="10115" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-black uppercase text-(--text-muted) mb-2 tracking-widest">{{ language.translateDynamic('Country') }}</label>
              <select v-model="country" class="w-full px-5 py-3 border-2 border-(--border-color) bg-(--card-bg) rounded-xl focus:outline-none focus:border-(--accent-color) transition-all bg-(--card-bg) text-(--text-color) shadow-inner font-bold" required>
                <option value="" disabled>{{ language.translateDynamic('Select your country') }}</option>
                <option v-for="c in countries" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
            <button
              @click="nextStep"
              class="w-full bg-(--accent-color) text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-(--accent-color)/20 transition-all hover:bg-[#1D4ED8] hover:scale-[1.02] active:scale-[0.98]"
            >
              {{ language.translateDynamic('Secure Payment 🔒') }}
            </button>
          </div>

          <!-- Step 2: Payment -->
          <div v-if="currentStep === 2" class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-black text-gray-900 dark:text-white">{{ language.translateDynamic('Payment Method') }}</h2>
            <div class="grid gap-4">
              <label class="flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-500 shadow-sm" 
                :class="paymentMethod === 'credit-card' ? 'border-(--accent-color) bg-(--accent-color)/5 ring-2 ring-(--accent-color)/20 shadow-lg' : 'border-(--border-color) bg-(--card-bg) hover:border-(--accent-color)/50'">
                <input type="radio" v-model="paymentMethod" value="credit-card" class="w-5 h-5 accent-(--accent-color)" />
                <div class="flex-1">
                  <div class="font-black text-(--text-color) uppercase tracking-tight">{{ language.translateDynamic('Credit Card') }}</div>
                  <div class="text-[10px] text-(--text-muted) font-bold uppercase tracking-widest">{{ language.translateDynamic('Safe & Secure Payment') }}</div>
                </div>
                <div class="text-3xl">💳</div>
              </label>
              
              <label class="flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-500 shadow-sm" 
                :class="paymentMethod === 'paypal' ? 'border-(--accent-color) bg-(--accent-color)/5 ring-2 ring-(--accent-color)/20 shadow-lg' : 'border-(--border-color) bg-(--card-bg) hover:border-(--accent-color)/50'">
                <input type="radio" v-model="paymentMethod" value="paypal" class="w-5 h-5 accent-(--accent-color)" />
                <div class="flex-1">
                  <div class="font-black text-(--text-color) uppercase tracking-tight">{{ language.translateDynamic('PayPal') }}</div>
                  <div class="text-[10px] text-(--text-muted) font-bold uppercase tracking-widest">{{ language.translateDynamic('One-click experience') }}</div>
                </div>
                <div class="text-3xl">🌍</div>
              </label>
 
              <label class="flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-500 shadow-sm" 
                :class="paymentMethod === 'cod' ? 'border-(--accent-color) bg-(--accent-color)/5 ring-2 ring-(--accent-color)/20 shadow-lg' : 'border-(--border-color) bg-(--card-bg) hover:border-(--accent-color)/50'">
                <input type="radio" v-model="paymentMethod" value="cod" class="w-5 h-5 accent-(--accent-color)" />
                <div class="flex-1">
                  <div class="font-black text-(--text-color) uppercase tracking-tight">{{ language.translateDynamic('Cash on Delivery') }}</div>
                  <div class="text-[10px] text-(--text-muted) font-bold uppercase tracking-widest">{{ language.translateDynamic('Pay at your doorstep') }}</div>
                </div>
                <div class="text-3xl">💵</div>
              </label>
            </div>
            
            <div class="flex gap-4 pt-6">
              <button
                @click="prevStep"
                class="flex-1 border-2 border-(--border-color) text-(--text-muted) py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 dark:hover:bg-gray-800 transition-all shadow-sm"
              >
                {{ language.translateDynamic('Back') }}
              </button>
              <button
                @click="placeOrder"
                class="flex-[2] bg-(--cta-color) hover:bg-(--cta-hover) text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all duration-500 shadow-2xl shadow-(--cta-color)/40 hover:scale-[1.05] active:scale-95"
              >
                {{ language.translateDynamic('Complete Payment') }} ({{ currency.format(total) }})
              </button>
            </div>
          </div>
        </div>

        <!-- summary -->
        <div class="bg-(--card-bg) rounded-2xl shadow-2xl p-8 border border-(--border-color) relative h-fit">
          <div class="absolute top-0 left-0 w-full h-1 bg-(--accent-color)"></div>

          <!-- Buy Now badge -->
          <div v-if="isBuyNow" class="flex items-center gap-2 mb-4 bg-(--cta-color)/10 border border-(--cta-color)/30 rounded-xl px-4 py-2.5">
            <span class="text-lg">⚡</span>
            <div>
              <p class="text-xs font-black text-(--cta-color) uppercase tracking-widest">{{ language.translateDynamic('Express Buy Now') }}</p>
              <p class="text-[10px] text-(--text-muted) font-medium">{{ language.translateDynamic('Checking out this item only — your cart is unchanged') }}</p>
            </div>
          </div>

          <h2 class="text-xs font-black text-(--text-muted) mb-8 uppercase tracking-[0.2em]">{{ language.translateDynamic('Purchase Details') }}</h2>
          <ul class="space-y-6">
            <li v-for="item in checkoutItems" :key="item.id" class="flex justify-between items-center gap-4">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 bg-white p-1 rounded-lg border border-(--border-color) shrink-0">
                  <img :src="item.thumbnail" class="w-full h-full object-contain" />
                </div>
                <span class="text-xs font-bold text-(--text-color) truncate uppercase tracking-tighter">{{ language.translateDynamic(item.title) }}</span>
              </div>
              <span class="text-sm font-black text-(--promo-color) shrink-0">{{ currency.format(item.price) }}</span>
            </li>
          </ul>
          <div class="mt-8 border-t border-(--border-color) pt-6 space-y-4">
            <div class="flex justify-between text-xs font-bold uppercase text-(--text-muted)">
              <span>{{ language.translateDynamic('Subtotal') }}</span>
              <span class="text-(--text-color)">{{ currency.format(subtotal) }}</span>
            </div>
            <div class="flex justify-between text-xs font-bold uppercase text-(--text-muted)">
              <span>{{ language.translateDynamic('Service Tax') }}</span>
              <span class="text-(--text-color)">{{ currency.format(tax) }}</span>
            </div>
            <div v-if="discount > 0 && !isBuyNow" class="flex justify-between text-xs font-bold uppercase animate-fade-in">
              <span class="text-green-500 flex items-center gap-1">🎟️ {{ language.translateDynamic('Coupon') }} ({{ cart.appliedCoupon }})</span>
              <span class="text-green-500">- {{ currency.format(discount) }}</span>
            </div>
            <div class="h-1 bg-dashed border-t-2 border-dashed border-(--border-color) my-2"></div>
            <div class="flex justify-between font-black text-2xl tracking-tighter text-(--promo-color)">
              <span class="uppercase text-xs self-center text-(--text-color) tracking-widest">{{ language.translateDynamic('Total Pay') }}</span>
              <span>{{ currency.format(total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

