<script setup lang="ts">
import { onMounted } from 'vue'
import { useCartStore } from './stores/cart'

const cart = useCartStore()

onMounted(() => {
  cart.load()
})
</script>

<template>
  <router-view />
</template>