<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import NavBar from '../components/NavBar.vue'

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
  <div class="min-h-screen flex flex-col bg-[var(--bg-color)] transition-colors duration-500">
    <NavBar />
    
    <div class="flex-grow flex items-center justify-center p-6 text-[var(--text-color)]">
      <div class="w-full max-w-md bg-[var(--card-bg)] border border-[var(--border-color)] rounded-sm shadow-sm overflow-hidden">
        <div class="p-8">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Login</h1>
            <p class="text-xs text-gray-500 font-bold mt-2 uppercase">Welcome back to OnlineStore</p>
          </div>

          <div v-if="auth.error" class="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-sm">
            {{ auth.error }}
          </div>

          <form @submit.prevent="handleLogin" class="space-y-4">
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-gray-400 uppercase">Username / Email</label>
              <input
                v-model="username"
                type="text"
                placeholder="Enter your username"
                class="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm rounded-sm outline-none focus:border-[#ff6600] transition-colors dark:text-white"
                required
              />
            </div>

            <div class="space-y-1">
              <div class="flex justify-between items-center">
                <label class="text-[10px] font-bold text-gray-400 uppercase">Password</label>
                <a href="#" class="text-[10px] text-blue-500 hover:underline font-bold">Forgot?</a>
              </div>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm rounded-sm outline-none focus:border-[#ff6600] transition-colors dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              :disabled="auth.isLoading"
              class="w-full bg-[#ff6600] hover:bg-[#e65c00] text-white font-bold py-3 rounded-sm transition disabled:opacity-50 uppercase text-xs"
            >
              {{ auth.isLoading ? 'Processing...' : 'Login' }}
            </button>
          </form>

          <div class="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
            <button
              @click="createDemoAccount"
              class="w-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 py-2.5 text-xs font-bold rounded-sm transition-colors uppercase dark:text-gray-300"
            >
              Demo Account
            </button>
            
            <p class="text-center text-xs text-gray-500 font-bold mt-6 uppercase">
              New here? 
              <button @click="router.push('/register')" class="text-[#ff6600] hover:underline">Create Account</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
