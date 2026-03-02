<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const email = ref('')
const firstName = ref('')
const lastName = ref('')
const error = ref('')
const isLoading = ref(false)

const handleRegister = async () => {
  error.value = ''
  isLoading.value = true
  try {
    const resp = await fetch('https://dummyjson.com/users/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
        email: email.value,
        firstName: firstName.value,
        lastName: lastName.value
      })
    })
    if (!resp.ok) throw new Error('Registration failed')
    const data = await resp.json()
    // after registration log them in
    await auth.login(username.value, password.value)
    router.push('/')
  } catch (e: any) {
    error.value = e.message || 'Registration error'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">
        <div class="text-center">
          <h1 class="text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">🛍️ Online Shopping Stores</h1>
          <p class="text-gray-600 dark:text-gray-300 text-lg font-semibold">Create Demo Account</p>
        </div>

        <div v-if="error" class="bg-red-100 border-l-4 border-red-600 p-4 rounded">
          <p class="text-red-800 font-semibold">{{ error }}</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">First Name</label>
            <input v-model="firstName" type="text" class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:bg-gray-700 dark:text-white transition" required />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Last Name</label>
            <input v-model="lastName" type="text" class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:bg-gray-700 dark:text-white transition" required />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Email</label>
            <input v-model="email" type="email" class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:bg-gray-700 dark:text-white transition" required />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Username</label>
            <input v-model="username" type="text" class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:bg-gray-700 dark:text-white transition" required />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Password</label>
            <input v-model="password" type="password" class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-600 dark:bg-gray-700 dark:text-white transition" required />
          </div>
          <button type="submit" :disabled="isLoading" class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isLoading ? 'Creating...' : 'Register & Login' }}
          </button>
        </form>

        <p class="text-xs text-center text-gray-600 dark:text-gray-400">
          Already have an account? <router-link to="/login" class="text-blue-600 dark:text-blue-400 hover:underline">Log in</router-link>
        </p>
      </div>
    </div>
  </div>
</template>
