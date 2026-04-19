<script setup lang="ts">
import { onMounted } from 'vue'
import { useCartStore } from './stores/cart'
import { useAuthStore } from './stores/auth'
import { useThemeStore } from './stores/theme'
import { useCurrencyStore } from './stores/currency'
import ToastNotification from './components/ToastNotification.vue'
import ChatBot from './components/ChatBot.vue'

const cart = useCartStore()
const auth = useAuthStore()
const theme = useThemeStore()
const currency = useCurrencyStore()

onMounted(() => {
  theme.loadTheme()
  currency.fetchLiveRates()
  cart.load()
  auth.loadSavedAuth()
})
</script>

<template>
  <ToastNotification />
  <ChatBot />
  <router-view />
</template>
