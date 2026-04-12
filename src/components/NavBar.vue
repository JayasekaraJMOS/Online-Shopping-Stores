<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useThemeStore } from '../stores/theme'
import { useSearchStore } from '../stores/search'
import { useCurrencyStore } from '../stores/currency'
import { useLanguageStore } from '../stores/language'
import logo from '../assets/logo.png'

const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()
const theme = useThemeStore()
const search = useSearchStore()
const currency = useCurrencyStore()
const language = useLanguageStore()

const isMenuOpen = ref(false)
const currencyOpen = ref(false)
const appDropOpen = ref(false)
const languageOpen = ref(false)

const selectLanguage = (code: string) => {
  language.setLanguage(code)
  languageOpen.value = false
}

const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value }
const selectCurrency = (code: string) => {
  currency.setCurrency(code)
  currencyOpen.value = false
}

const logout = () => {
  auth.logout()
  isMenuOpen.value = false
  router.push('/')
}

const handleNav = (path: string) => {
  router.push(path)
  isMenuOpen.value = false
}

const closeOnOutside = () => { 
  currencyOpen.value = false
  appDropOpen.value = false 
  languageOpen.value = false
}
onMounted(() => window.addEventListener('click', closeOnOutside))
onUnmounted(() => window.removeEventListener('click', closeOnOutside))
</script>

<template>
  <header class="sticky top-0 z-50 bg-[#2563EB] text-white shadow-md font-sans">
    <!-- Top Utility Bar (Universal) -->
    <div class="bg-[#1E3A8A] text-[9px] sm:text-[12px] py-2 md:py-1.5 border-b border-white/10">
      <div class="max-w-7xl mx-auto px-2 flex flex-wrap items-center justify-center md:justify-end gap-x-4 sm:gap-x-6 gap-y-2 uppercase font-bold tracking-wider opacity-90 w-full">
        <!-- Save More on App trigger -->
        <div class="relative shrink-0 z-[60]">
          <button @click.stop="appDropOpen = !appDropOpen" class="hover:text-blue-200 transition-colors flex items-center gap-1">
            {{ language.t.saveApp }}
            <svg class="w-3 h-3 opacity-70 transition-transform" :class="appDropOpen ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"/></svg>
          </button>
          
          <div v-if="appDropOpen" @click.stop class="absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 w-64 p-5">
            <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45"></div>
            <p class="text-gray-800 font-black text-sm mb-4">{{ language.t.downloadApp }}</p>
            <div class="flex justify-center mb-4"><img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://omax.store/app" class="w-36 h-36 rounded-lg" /></div>
            <div class="flex flex-col gap-2">
              <a href="#" class="flex items-center gap-3 bg-black text-white rounded-xl px-4 py-2 hover:opacity-90"><span>🍎</span><p class="text-sm font-black">App Store</p></a>
              <a href="#" class="flex items-center gap-3 bg-black text-white rounded-xl px-4 py-2 hover:opacity-90"><span>▶️</span><p class="text-sm font-black">Google Play</p></a>
            </div>
          </div>
        </div>

        <button @click="handleNav('/become-a-seller')" class="hover:text-blue-200 transition-colors shrink-0">{{ language.t.seller }}</button>
        <button @click="handleNav('/help')" class="hover:text-blue-200 transition-colors shrink-0">{{ language.t.help }}</button>
        <span class="text-blue-200 uppercase shrink-0 hidden sm:inline">Jayasekara J.M.O.S.</span>
      </div>
    </div>

    <!-- Main Header -->
    <div class="max-w-7xl mx-auto px-2 sm:px-4 py-0.5 md:py-1">
      <div class="flex items-center justify-between gap-2 sm:gap-4">
        <!-- Left: Logo + Burger -->
        <div class="flex items-center gap-2 sm:gap-4 shrink-0">
          <button @click="toggleMenu" class="md:hidden p-1 -ml-2 text-white">
            <svg v-if="!isMenuOpen" class="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>
            <svg v-else class="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>

          <router-link to="/" class="flex items-center shrink-0 group relative z-10 transition-transform active:scale-95">
            <div 
              class="h-10 w-28 sm:h-14 sm:w-44 md:h-32 md:w-[380px] bg-white"
              :style="`mask-image: url(${logo}); -webkit-mask-image: url(${logo}); mask-size: contain; -webkit-mask-size: contain; mask-repeat: no-repeat; -webkit-mask-repeat: no-repeat; mask-position: center; -webkit-mask-position: center; mask-mode: luminance; -webkit-mask-mode: luminance; pointer-events: none;`"
            ></div>
          </router-link>
        </div>

        <!-- Middle: Search Bar (Desktop) -->
        <div class="hidden md:flex flex-grow max-w-xl mx-8">
           <div class="flex-grow flex bg-white dark:bg-gray-800 rounded-lg overflow-hidden h-10 shadow-inner">
            <input v-model="search.query" type="text" :placeholder="language.t.search" class="w-full py-2 px-4 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none font-medium">
            <button class="bg-[#F1F5F9] dark:bg-gray-700 px-6 hover:bg-blue-50 transition-colors">
              <svg class="h-4 w-4 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </button>
          </div>
        </div>

        <!-- Right: Utils -->
        <div class="flex items-center gap-1 sm:gap-1.5 md:gap-4 shrink-0">
          <!-- Language Dropdown Box -->
          <div class="relative shrink-0">
            <button @click.stop="languageOpen = !languageOpen" class="flex items-center gap-0.5 sm:gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[9px] sm:text-[10px] md:text-xs font-black px-1.5 sm:px-2 md:px-3 h-8 sm:h-9 rounded-lg transition-all tracking-widest uppercase truncate max-w-[50px] sm:max-w-none">
              <span class="text-xs sm:text-base hidden sm:inline">🌐</span>
              <span class="inline">{{ language.selectedCode }}</span>
              <svg class="w-3 h-3 opacity-70 transition-transform" :class="{ 'rotate-180': languageOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div v-if="languageOpen" @click.stop class="absolute top-[calc(100%+8px)] right-0 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden w-32 py-1">
              <button v-for="l in language.LANGUAGES" :key="l.code" @click="selectLanguage(l.code)" class="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] sm:text-xs hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold" :class="l.code === language.selectedCode ? 'bg-blue-50 dark:bg-gray-700 text-blue-600' : ''">
                <span>{{ l.code }}</span>
                <span class="flex-grow text-left opacity-70">{{ l.name }}</span>
              </button>
            </div>
          </div>

          <!-- Currency Dropdown Box -->
          <div class="relative shrink-0">
            <button @click.stop="currencyOpen = !currencyOpen" class="flex items-center gap-0.5 sm:gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[9px] sm:text-[10px] md:text-xs font-black px-1.5 sm:px-2 md:px-3 h-8 sm:h-9 rounded-lg transition-all tracking-widest uppercase truncate max-w-[55px] sm:max-w-none">
              <span class="text-xs sm:text-base">{{ currency.selected.flag }}</span>
              <span class="inline">{{ currency.selected.code }}</span>
              <svg class="w-3 h-3 opacity-70 transition-transform" :class="{ 'rotate-180': currencyOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div v-if="currencyOpen" @click.stop class="absolute top-[calc(100%+8px)] right-0 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden w-32 sm:w-40 py-1">
              <button v-for="c in currency.CURRENCIES" :key="c.code" @click="selectCurrency(c.code)" class="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-[10px] sm:text-xs hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold" :class="c.code === currency.selectedCode ? 'bg-blue-50 dark:bg-gray-700 text-blue-600' : ''">
                <span>{{ c.flag }}</span>
                <span class="flex-grow text-left">{{ c.code }}</span>
              </button>
            </div>
          </div>

          <!-- Cart -->
          <button @click="handleNav('/cart')" class="relative p-2 hover:bg-white/10 rounded-lg transition-all">
            <svg class="h-6 w-6 md:h-7 md:w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span v-if="cart.count > 0" class="absolute -top-0.5 -right-0.5 bg-[#10B981] text-white text-[8px] md:text-[9px] font-black min-w-[17px] h-4.5 flex items-center justify-center rounded-full border border-[#2563EB] shadow-lg">{{ cart.count }}</span>
          </button>

          <!-- Theme -->
          <button @click="theme.toggleDarkMode" class="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 border border-white/10 hidden md:flex">
             <span class="hidden md:inline text-[9px] font-black uppercase tracking-widest opacity-80">{{ theme.isDark ? 'Light' : 'Dark' }}</span>
             <span class="text-sm">{{ theme.isDark ? '☀️' : '🌙' }}</span>
          </button>

          <!-- Login (Desktop) -->
          <div class="hidden md:flex items-center gap-4 border-l border-white/20 pl-6 ml-2">
              <button v-if="!auth.isAuthenticated" @click="handleNav('/login')" class="text-[11px] font-black tracking-widest hover:text-blue-200 transition-colors">{{ language.t.login }}</button>
              <button v-else @click="logout" class="text-[11px] font-black tracking-widest hover:text-red-300 transition-colors">{{ language.t.logout }}</button>
          </div>
          
          <!-- Mobile Theme Toggle -->
          <button @click="theme.toggleDarkMode" class="md:hidden p-2 hover:bg-white/10 rounded-lg">
             <span class="text-lg">{{ theme.isDark ? '☀️' : '🌙' }}</span>
          </button>
        </div>
      </div>

      <!-- Mobile Search Row -->
      <div class="md:hidden mt-3 px-1">
        <div class="flex bg-white dark:bg-gray-800 rounded-lg overflow-hidden h-10 shadow-inner border border-white/10">
          <input v-model="search.query" type="text" :placeholder="language.t.search" class="w-full py-2 px-4 text-[13px] text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none font-medium">
          <button class="bg-[#F1F5F9] dark:bg-gray-700 px-4">
            <svg class="h-4 w-4 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-x-full"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 -translate-x-full"
    >
      <div v-if="isMenuOpen" class="fixed inset-0 z-[60] bg-[#1E3A8A] md:hidden flex flex-col p-8 pt-24 gap-6">
        <button @click="toggleMenu" class="absolute top-6 right-6 text-white p-2">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <nav class="flex flex-col gap-8 text-2xl font-black tracking-tighter uppercase">
          <button @click="handleNav('/')" class="hover:text-blue-300 text-left">{{ language.t.home }}</button>
          <button @click="handleNav('/become-a-seller')" class="hover:text-blue-300 text-left">{{ language.t.seller }}</button>
          <button @click="handleNav('/help')" class="hover:text-blue-300 text-left">{{ language.t.help }}</button>
          <button @click="handleNav('/cart')" class="hover:text-blue-300 text-left">{{ language.t.cart }} ({{ cart.count }})</button>
          
          <div class="h-px bg-white/10 w-full my-4"></div>
          
          <button v-if="!auth.isAuthenticated" @click="handleNav('/login')" class="text-blue-300 text-left">{{ language.t.login }}</button>
          <button v-else @click="logout" class="text-red-400 text-left">{{ language.t.logout }}</button>
        </nav>

        <div class="mt-auto opacity-40 text-xs font-bold tracking-widest uppercase">
          Jayasekara J.M.O.S. &bull; OMAX Online Store
        </div>
      </div>
    </transition>
  </header>
</template>
