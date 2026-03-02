<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  const success = await auth.login(username.value, password.value)
  if (success) {
    router.push('/')
  }
}

// Demo accounts from DummyJSON
const demoAccounts = [
  // updated with credentials currently documented by DummyJSON
  { username: 'kminchelle', password: '0lelplR' },
  { username: 'claudette09', password: 'ewRjLYr' } // second example
]

const useDemoAccount = async (user: string, pass: string) => {
  username.value = user
  password.value = pass
  // automatically attempt login after filling
  await handleLogin()
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- Card -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">
        <!-- Header -->
        <div class="text-center">
          <h1 class="text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">🛍️ ShopHub</h1>
          <p class="text-gray-600 dark:text-gray-300 text-lg font-semibold">Premium Products Store</p>
        </div>

        <!-- Error Message -->
        <div v-if="auth.error" class="bg-red-100 border-l-4 border-red-600 p-4 rounded">
          <p class="text-red-800 font-semibold">{{ auth.error }}</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Username -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Username</label>
            <input
              v-model="username"
              type="text"
              placeholder="Enter username"
              class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:bg-gray-700 dark:text-white transition"
              required
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Password</label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter password"
                class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:bg-gray-700 dark:text-white transition"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="auth.isLoading"
            class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ auth.isLoading ? 'Logging in...' : 'Log In' }}
          </button>
        </form>

        <!-- Divider -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Demo Accounts</span>
          </div>
        </div>

        <!-- Demo Accounts -->
        <div class="space-y-2">
          <p class="text-xs text-gray-600 dark:text-gray-400 text-center">Click to use demo account:</p>
          <div v-for="(account, index) in demoAccounts" :key="index" class="flex gap-2">
            <button
              type="button"
              @click="useDemoAccount(account.username, account.password)"
              class="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-sm font-mono text-gray-700 dark:text-gray-200 transition"
            >
              {{ account.username }}
            </button>
          </div>
        </div>

        <!-- Footer Note -->
        <p class="text-xs text-center text-gray-600 dark:text-gray-400">
          Uses demo data from 
          <a href="https://dummyjson.com" target="_blank" class="text-blue-600 dark:text-blue-400 hover:underline">
            DummyJSON.com
          </a>
        </p>
      </div>
    </div>
  </div>
</template>
