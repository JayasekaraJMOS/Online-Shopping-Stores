<script setup lang="ts">
import { onMounted } from 'vue'
import { useCartStore } from './stores/cart'
import ToastNotification from './components/ToastNotification.vue'

const cart = useCartStore()

onMounted(() => {
  cart.load()
})
</script>

<template>
  <ToastNotification />
  <router-view />
</template>
