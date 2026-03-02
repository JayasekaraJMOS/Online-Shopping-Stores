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
// demo functionality now generates a user programmatically
const demoAccounts = [] // kept for structure but unused

const createDemoAccount = async () => {
  // generate simple random credentials
  const rand = Math.floor(Math.random() * 100000)
  const user = `demo${rand}`
  const pass = `Pass${rand}`
  try {
    const response = await fetch('https://dummyjson.com/users/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: user,
        password: pass,
        email: `${user}@example.com`,
        firstName: 'Demo',
        lastName: rand.toString()
      })
    })
    if (!response.ok) throw new Error('Failed to create demo account')
    username.value = user
    password.value = pass
    await handleLogin()
  } catch (e: any) {
    auth.error = e.message || 'Demo creation failed'
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- Card -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">
        <!-- Header -->
        <div class="text-center">
          <h1 class="text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">🛍️ Online Shopping Stores</h1>
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
          <button
            type="button"
            @click="router.back()"
            class="mt-2 w-full text-center text-sm text-gray-600 dark:text-gray-400 hover:underline"
          >
            ← Back
          </button>
        </form>

        <!-- Demo generation -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Demo Account</span>
          </div>
        </div>

        <div class="text-center">
          <button
            type="button"
            @click="createDemoAccount"
            class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition"
          >
            Create & Login Demo
          </button>
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
