<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useThemeStore } from '../stores/theme'
import { useSearchStore } from '../stores/search'

const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()
const theme = useThemeStore()
const search = useSearchStore()

const goToHome = () => router.push('/')
const goToCart = () => router.push('/cart')
const login = () => router.push('/login')
const logout = () => {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-[#ff6600] text-white shadow-sm font-sans">
    <!-- Top Utility Bar -->
    <div class="bg-[#f85606] text-[12px] py-1 hidden md:block">
      <div class="max-w-7xl mx-auto px-4 flex justify-end gap-6 uppercase font-medium">
        <a href="#" class="hover:text-gray-200">Save More on App</a>
        <a href="#" class="hover:text-gray-200">Become a Seller</a>
        <a href="#" class="hover:text-gray-200">Help & Support</a>
        <span class="opacity-80">JAYASEKARA J.M.O.S.</span>
      </div>
    </div>

    <!-- Main Header -->
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-8">
      <!-- Logo -->
      <button @click="goToHome" class="flex items-center gap-2 shrink-0">
        <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
          <span class="text-[#ff6600] font-black text-2xl italic">D</span>
        </div>
        <span class="text-3xl font-extrabold tracking-tight hidden lg:block">Daraz</span>
      </button>

      <!-- Search Bar -->
      <div class="flex-grow max-w-2xl">
        <div class="flex bg-white dark:bg-gray-800 rounded-sm overflow-hidden h-11 shadow-sm border border-transparent dark:border-gray-700">
          <input 
            type="text" 
            v-model="search.query"
            placeholder="Search in Daraz"
            class="w-full py-2 px-4 text-[14px] text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
          >
          <button class="bg-[#eff0f5] dark:bg-gray-700 px-6 hover:bg-[#e2e3e8] dark:hover:bg-gray-600 transition-colors border-l border-gray-100 dark:border-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#ff6600]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-6 shrink-0">
        <button @click="goToCart" class="relative hover:opacity-80 transition group">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span v-if="cart.count > 0" class="absolute -top-1.5 -right-1.5 bg-[#f85606] text-white text-[10px] font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full border-2 border-[#ff6600] shadow-sm">
            {{ cart.count }}
          </span>
        </button>

        <button @click="theme.toggleDarkMode" class="p-2 hover:bg-white/10 rounded-full transition md:flex items-center gap-2">
           <span class="text-xs font-bold uppercase">{{ theme.isDark ? 'Light' : 'Dark' }}</span>
           <span>{{ theme.isDark ? '☀️' : '🌙' }}</span>
        </button>

        <div class="hidden md:flex items-center gap-4 border-l border-white/20 pl-6 ml-2">
            <button v-if="!auth.isAuthenticated" @click="login" class="text-xs font-bold hover:underline">LOGIN</button>
            <button v-else @click="logout" class="text-xs font-bold hover:underline">LOGOUT</button>
        </div>
      </div>
    </div>
  </header>
</template>