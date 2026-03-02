<script setup lang="ts">
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import { useRouter } from 'vue-router'

const cart = useCartStore()
const auth = useAuthStore()
const theme = useThemeStore()
const router = useRouter()
cart.load()
auth.loadSavedAuth()

const goToHome = () => {
  router.push('/')
}

const goToCart = () => {
  router.push('/cart')
}

const logout = () => {
  auth.logout()
  router.push('/login')
}

const login = () => {
  router.push('/login')
}
</script>

<template>
  <nav class="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 shadow-lg transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <!-- Logo -->
      <button @click="goToHome" class="flex items-center gap-2 hover:opacity-90 transition group">
        <span class="text-3xl group-hover:scale-110 transition">🛍️</span>
        <div>
          <h1 class="text-2xl font-bold text-white">Online Shopping Stores</h1>
          <p class="text-blue-100 dark:text-blue-300 text-xs">Your Favorite Shop</p>
        </div>
      </button>

      <!-- Right Section -->
      <div class="flex items-center gap-4">
        <!-- User Info -->
        <div v-if="auth.isAuthenticated" class="text-white text-sm">
          <p class="font-semibold">{{ auth.username }}</p>
          <p class="text-blue-100 dark:text-blue-300 text-xs">Logged in</p>
        </div>

        <!-- Dark Mode Toggle -->
        <button
          @click="theme.toggleDarkMode"
          class="p-2 bg-white/20 hover:bg-white/30 rounded-full transition text-white text-xl"
          :title="theme.isDark ? 'Light mode' : 'Dark mode'"
        >
          {{ theme.isDark ? '☀️' : '🌙' }}
        </button>

        <!-- Cart Button -->
        <button 
          @click="goToCart"
          class="flex items-center gap-2 bg-white text-blue-600 dark:text-blue-700 px-6 py-2 rounded-full font-bold hover:bg-blue-50 dark:hover:bg-blue-100 transition duration-200 shadow-md"
        >
          <span class="text-xl">🛒</span>
          <span>({{ cart.count }})</span>
        </button>

        <!-- Auth Button -->
        <button
          v-if="auth.isAuthenticated"
          @click="logout"
          class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold transition duration-200"
        >
          Logout
        </button>
        <button
          v-else
          @click="login"
          class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold transition duration-200"
        >
          Login
        </button>
      </div>
    </div>
  </nav>
</template>