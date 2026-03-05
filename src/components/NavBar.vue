<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useThemeStore } from '../stores/theme'
import { useSearchStore } from '../stores/search'
import { useCurrencyStore } from '../stores/currency'
import logo from '../assets/logo.png'

const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()
const theme = useThemeStore()
const search = useSearchStore()
const currency = useCurrencyStore()

const currencyOpen = ref(false)

const goToHome = () => router.push('/')
const goToCart = () => router.push('/cart')
const login = () => router.push('/login')
const logout = () => {
  auth.logout()
  router.push('/')
}

const selectCurrency = (code: string) => {
  currency.setCurrency(code)
  currencyOpen.value = false
}

const closeOnOutside = () => { currencyOpen.value = false }
onMounted(() => window.addEventListener('click', closeOnOutside))
onUnmounted(() => window.removeEventListener('click', closeOnOutside))
</script>

<template>
  <header class="sticky top-0 z-50 bg-[#2563EB] text-white shadow-md font-sans">
    <!-- Top Utility Bar -->
    <div class="bg-[#1E3A8A] text-[12px] py-1.5 hidden md:block border-b border-white/10">
      <div class="max-w-7xl mx-auto px-4 flex justify-end gap-6 uppercase font-bold tracking-wider opacity-90">
        <a href="#" class="hover:text-blue-200 transition-colors">Save More on App</a>
        <a href="#" class="hover:text-blue-200 transition-colors">Become a Seller</a>
        <a href="#" class="hover:text-blue-200 transition-colors">Help & Support</a>
        <span class="text-blue-200">JAYASEKARA J.M.O.S.</span>
      </div>
    </div>

    <!-- Main Header -->
    <div class="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between gap-6">
      <!-- Logo -->
      <button @click="goToHome" class="flex items-center gap-4 shrink-0 group relative z-10">
        <div class="h-20 w-36 flex items-center justify-center group-hover:scale-105 transition-all overflow-visible">
          <!-- No background box. Using a fractional CSS drop-shadow matrix to create a very thin, subtle black outline that looks correct even when scaled up by 2.5x -->
          <img :src="logo" alt="OMAX ONLINE STORE" class="w-full h-full object-contain scale-[2.5] pointer-events-none" style="filter: drop-shadow(0.4px 0.4px 0 rgba(0,0,0,0.8)) drop-shadow(-0.4px -0.4px 0 rgba(0,0,0,0.8)) drop-shadow(0.4px -0.4px 0 rgba(0,0,0,0.8)) drop-shadow(-0.4px 0.4px 0 rgba(0,0,0,0.8)) drop-shadow(0px 4px 5px rgba(0,0,0,0.4));" />
        </div>
      </button>

      <!-- Search Bar + Currency -->
      <div class="flex-grow max-w-2xl flex items-center gap-2">

        <!-- Search Input -->
        <div class="flex-grow flex bg-white dark:bg-gray-800 rounded-lg overflow-hidden h-11 shadow-inner border-2 border-transparent focus-within:border-blue-300 transition-all">
          <input
            type="text"
            v-model="search.query"
            placeholder="Search in OMAX..."
            class="w-full py-2 px-4 text-[14px] text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none placeholder:text-gray-400 font-medium"
          >
          <button class="bg-[#F1F5F9] dark:bg-gray-700 px-6 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors border-l border-gray-100 dark:border-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        <!-- Currency Selector (RIGHT of search) -->
        <div class="relative shrink-0">
          <button
            @click.stop="currencyOpen = !currencyOpen"
            class="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-black px-3 h-11 rounded-lg transition-all whitespace-nowrap relative"
          >
            <!-- Live rate dot -->
            <span
              v-if="currency.ratesLoaded"
              class="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full border border-white shadow"
              title="Live rates"
            ></span>
            <span v-else class="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full border border-white animate-pulse shadow" title="Loading rates..."></span>
            <span class="text-base leading-none">{{ currency.selected.flag }}</span>
            <span class="tracking-widest">{{ currency.selected.code }}</span>
            <svg class="w-3 h-3 opacity-70 transition-transform" :class="{ 'rotate-180': currencyOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          <!-- Dropdown -->
          <div
            v-if="currencyOpen"
            @click.stop
            class="absolute top-[calc(100%+8px)] right-0 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden w-44 py-1"
          >
            <button
              v-for="c in currency.CURRENCIES"
              :key="c.code"
              @click="selectCurrency(c.code)"
              class="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
              :class="c.code === currency.selectedCode ? 'bg-blue-50 dark:bg-gray-700 font-black text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200 font-medium'"
            >
              <span class="text-base">{{ c.flag }}</span>
              <span class="flex-grow text-left">{{ c.code }}</span>
              <span class="text-xs opacity-60">{{ c.symbol }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-6 shrink-0">
        <button @click="goToCart" class="relative group p-2 hover:bg-white/10 rounded-xl transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span v-if="cart.count > 0" class="absolute -top-1.5 -right-2 bg-[#10B981] text-white text-[10px] font-black min-w-[22px] h-5.5 flex items-center justify-center rounded-full border-2 border-[#2563EB] shadow-lg animate-bounce">
            {{ cart.count }}
          </span>
        </button>

        <button @click="theme.toggleDarkMode" class="p-2 hover:bg-white/10 rounded-xl transition-colors md:flex items-center gap-2 border border-white/20">
           <span class="text-[10px] font-black uppercase tracking-widest">{{ theme.isDark ? 'Light' : 'Dark' }}</span>
           <span class="text-sm scale-110">{{ theme.isDark ? '☀️' : '🌙' }}</span>
        </button>

        <div class="hidden md:flex items-center gap-4 border-l border-white/20 pl-6 ml-2">
            <button v-if="!auth.isAuthenticated" @click="login" class="text-xs font-black tracking-widest hover:text-blue-200 transition-colors">LOGIN</button>
            <button v-else @click="logout" class="text-xs font-black tracking-widest hover:text-red-300 transition-colors">LOGOUT</button>
        </div>
      </div>
    </div>
  </header>
</template>
