<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import NavBar from '../components/NavBar.vue'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const logout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <NavBar />
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-850 transition-colors duration-300 py-12 px-6">
    <div class="max-w-3xl mx-auto bg-white dark:bg-gray-700 rounded-2xl shadow-xl p-8">
      <h1 class="text-3xl font-black text-gray-900 dark:text-white mb-6">My Profile</h1>
      <div v-if="auth.user" class="space-y-4">
        <div>
          <span class="font-semibold">Username:</span> {{ auth.user.username }}
        </div>
        <div>
          <span class="font-semibold">Name:</span> {{ auth.user.firstName }} {{ auth.user.lastName }}
        </div>
        <div>
          <span class="font-semibold">Email:</span> {{ auth.user.email }}
        </div>
        <button @click="logout" class="mt-6 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold transition">Logout</button>
      </div>
      <div v-else class="text-center">
        <p class="text-gray-600 dark:text-gray-300">You are not logged in.</p>
        <button @click="() => router.push('/login')" class="mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold transition">Login</button>
      </div>
    </div>
  </div>
</template>
