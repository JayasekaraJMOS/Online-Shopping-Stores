<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useThemeStore } from '../stores/theme'
import { useSearchStore } from '../stores/search'
import type { SortOption } from '../stores/search'
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
const sortOpen = ref(false)
const searchOpen = ref(false)
const isScrolled = ref(false)

const handleScroll = () => {
  const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
  isScrolled.value = scrollPos > 20
}



onMounted(() => {
  window.addEventListener('click', closeOnOutside)
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll() // Initial check
})
onUnmounted(() => {
  window.removeEventListener('click', closeOnOutside)
  window.removeEventListener('scroll', handleScroll)
})

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'best',       label: 'Best Match' },
  { value: 'price_asc',  label: 'Price low to high' },
  { value: 'price_desc', label: 'Price high to low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'newest',     label: 'Newest' },
]


const selectSort = (val: SortOption) => {
  search.setSortBy(val)
  sortOpen.value = false
}

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
  sortOpen.value = false
  searchOpen.value = false
}
</script>

<template>
  <header class="sticky top-0 w-full z-50 bg-[#2563EB]/95 backdrop-blur-md text-white shadow-md font-sans smooth-transition">
    <!-- Top Utility Bar (Universal) -->
    <div class="bg-[#1E3A8A] text-[9px] sm:text-[12px] border-b border-white/10 smooth-transition" :class="isScrolled ? 'py-0.5 md:py-1' : 'py-2 md:py-1.5'">
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
              <a href="#" class="flex items-center gap-3 bg-black text-white rounded-xl px-4 py-2 hover:opacity-90 no-underline"><span>🍎</span><p class="text-sm font-black">{{ language.translateDynamic('App Store') }}</p></a>
              <a href="#" class="flex items-center gap-3 bg-black text-white rounded-xl px-4 py-2 hover:opacity-90 no-underline"><span>▶️</span><p class="text-sm font-black">{{ language.translateDynamic('Google Play') }}</p></a>
            </div>
          </div>
        </div>

        <button @click="handleNav('/become-a-seller')" class="hover:text-blue-200 transition-colors shrink-0">{{ language.t.seller }}</button>
        <button @click="handleNav('/help')" class="hover:text-blue-200 transition-colors shrink-0">{{ language.t.help }}</button>
        <span class="text-blue-200 uppercase shrink-0 hidden sm:inline">Jayasekara J.M.O.S.</span>
      </div>
    </div>

    <!-- Main Header -->
    <div class="max-w-7xl mx-auto px-2 sm:px-4 smooth-transition" :class="isScrolled ? 'py-0.5 md:py-0.5' : 'py-1.5 md:py-4'">
      <div class="flex items-center justify-between gap-2 sm:gap-4">
        <!-- Left: Logo + Burger -->
        <div class="flex items-center gap-2 sm:gap-4 shrink-0">
          <button @click="toggleMenu" class="md:hidden p-1 -ml-2 text-white">
            <svg v-if="!isMenuOpen" class="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>
            <svg v-else class="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>

          <router-link to="/" class="flex items-center shrink-0 group relative z-10 transition-transform active:scale-95">
            <div 
              class="h-10 w-28 sm:h-14 sm:w-44 md:h-20 md:w-[240px] bg-white smooth-transition origin-left"
              :class="isScrolled ? 'scale-75' : 'scale-100'"
              :style="(`mask-image: url(${logo}); -webkit-mask-image: url(${logo}); mask-size: contain; -webkit-mask-size: contain; mask-repeat: no-repeat; -webkit-mask-repeat: no-repeat; mask-position: center; -webkit-mask-position: center; mask-mode: luminance; -webkit-mask-mode: luminance; pointer-events: none;` as any)"
            ></div>
          </router-link>
        </div>

        <!-- Middle: Search Bar (Desktop) -->
        <div class="hidden md:flex grow max-w-3xl ml-3 mr-6 items-center gap-2">
          <!-- Sort By Icon Button -->
          <div class="relative shrink-0" @click.stop>
            <button
              id="sort-by-btn"
              @click="sortOpen = !sortOpen"
              title="Sort By"
              class="relative flex items-center justify-center w-10 h-10 rounded-lg transition-all bg-white/15 hover:bg-white/25 border border-white/30"
              :class="search.sortBy !== 'best' ? 'ring-2 ring-white/60' : ''"
            >
              <!-- Sliders / Filter icon -->
              <svg class="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M7 12h10M10 18h4"/>
              </svg>
              <!-- Active indicator dot -->
              <span v-if="search.sortBy !== 'best'" class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border border-[#2563EB]"></span>
            </button>
            <div
              v-if="sortOpen"
              class="absolute top-[calc(100%+6px)] left-0 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden w-48 py-1.5"
            >
              <!-- Header label -->
              <p class="px-4 pt-2 pb-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Sort By</p>
              <button
                v-for="opt in SORT_OPTIONS"
                :key="opt.value"
                @click="selectSort(opt.value)"
                class="w-full text-left px-4 py-2.5 text-[13px] font-semibold transition-colors flex items-center gap-2"
                :class="search.sortBy === opt.value
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] font-bold'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'"
              >
                <span v-if="search.sortBy === opt.value" class="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0"></span>
                <span v-else class="w-1.5 h-1.5 rounded-full bg-transparent shrink-0"></span>
                {{ opt.label }}
              </button>
            </div>
          </div>

          <!-- Search Input -->
          <div class="grow relative" @click.stop>
            <div class="flex bg-white dark:bg-gray-800 rounded-lg overflow-hidden h-10 shadow-inner border border-transparent focus-within:border-(--accent-color)/50 transition-all">
              <input 
                v-model="search.query" 
                @focus="searchOpen = true"
                type="text" 
                :placeholder="language.t.search" 
                class="w-full py-2 px-4 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none font-medium"
              >
              
              <!-- Clear Button -->
              <button 
                v-if="search.query" 
                @click="search.clearSearch()"
                class="px-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>

              <button 
                @click="search.addRecentSearch(search.query)"
                class="bg-[#F1F5F9] dark:bg-gray-700 px-6 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
              >
                <svg class="h-4 w-4 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </button>
            </div>

            <!-- Suggestions Dropdown -->
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-2"
            >
              <div 
                v-if="searchOpen && (search.suggestions.length > 0 || search.recentSearches.length > 0)" 
                class="absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 py-2"
              >
                <!-- Recent Searches -->
                <div v-if="!search.query && search.recentSearches.length > 0">
                  <p class="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">Recent Searches</p>
                  <button 
                    v-for="s in search.recentSearches" 
                    :key="s"
                    @click="search.query = s; searchOpen = false"
                    class="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm flex items-center gap-3 text-gray-600 dark:text-gray-300"
                  >
                    <span class="opacity-40">🕒</span> {{ s }}
                  </button>
                </div>

                <!-- Live Suggestions -->
                <div v-if="search.query && search.suggestions.length > 0">
                  <p class="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">Suggestions</p>
                  <button 
                    v-for="s in search.suggestions" 
                    :key="s"
                    @click="search.query = s; search.addRecentSearch(s); searchOpen = false"
                    class="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm flex items-center gap-3 text-gray-700 dark:text-gray-200 font-semibold"
                  >
                    <span class="text-[#2563EB]">🔍</span> {{ s }}
                  </button>
                </div>
              </div>
            </transition>
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
                <span class="grow text-left opacity-70">{{ l.name }}</span>
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
                <span class="grow text-left">{{ c.code }}</span>
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
             <span class="hidden md:inline text-[9px] font-black uppercase tracking-widest opacity-80">{{ language.translateDynamic(theme.isDark ? 'Light' : 'Dark') }}</span>
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
      <div class="md:hidden mt-3 px-1 flex items-center gap-2">
        <!-- Mobile Sort Icon Button -->
        <div class="relative shrink-0" @click.stop>
          <button
            id="mobile-sort-btn"
            @click="sortOpen = !sortOpen"
            title="Sort By"
            class="relative flex items-center justify-center w-10 h-10 rounded-lg bg-white/15 hover:bg-white/25 border border-white/30 transition-all"
            :class="search.sortBy !== 'best' ? 'ring-2 ring-white/60' : ''"
          >
            <svg class="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M7 12h10M10 18h4"/>
            </svg>
            <span v-if="search.sortBy !== 'best'" class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border border-[#2563EB]"></span>
          </button>
          <div
            v-if="sortOpen"
            class="absolute top-[calc(100%+6px)] left-0 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden w-44 py-1.5"
          >
            <p class="px-4 pt-2 pb-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Sort By</p>
            <button
              v-for="opt in SORT_OPTIONS"
              :key="opt.value"
              @click="selectSort(opt.value)"
              class="w-full text-left px-4 py-2.5 text-[13px] font-semibold transition-colors flex items-center gap-2"
              :class="search.sortBy === opt.value
                ? 'bg-blue-50 dark:bg-blue-900/30 text-[#2563EB] font-bold'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'"
            >
              <span v-if="search.sortBy === opt.value" class="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0"></span>
              <span v-else class="w-1.5 h-1.5 rounded-full bg-transparent shrink-0"></span>
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- Mobile Search Input -->
        <div class="grow flex bg-white dark:bg-gray-800 rounded-lg overflow-hidden h-10 shadow-inner border border-white/10">
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
