<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import NavBar from '../components/NavBar.vue'
import { useLanguageStore } from '../stores/language'

const router = useRouter()
const auth = useAuthStore()
const language = useLanguageStore()

const username = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  const success = await auth.login(username.value, password.value)
  if (success) {
    router.push('/')
  }
}



// Use a known dummyjson test account — the /users/add endpoint is a mock
// that does NOT persist users, so we log in with a real seeded account instead.
const DEMO_USER = 'emilys'
const DEMO_PASS = 'emilyspass'

const createDemoAccount = async () => {
  username.value = DEMO_USER
  password.value = DEMO_PASS
  await handleLogin()
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-(--bg-color) transition-colors duration-500">
    <NavBar />
    
    <div class="grow flex items-center justify-center p-6 text-(--text-color)">
      <div class="w-full max-w-md bg-(--card-bg) border border-(--border-color) rounded-sm shadow-sm overflow-hidden">
        <div class="p-8">
          <div class="text-center mb-10">
            <h1 class="text-4xl font-black text-(--text-color) tracking-tighter uppercase">{{ language.translateDynamic('Welcome') }}</h1>
            <p class="text-[10px] text-(--text-muted) font-black mt-2 uppercase tracking-[0.2em]">{{ language.translateDynamic('Enter your credentials to continue') }}</p>
          </div>

          <div v-if="auth.error" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-[10px] font-black uppercase rounded-xl shadow-sm animate-fade-in">
            ⚠️ {{ auth.error }}
          </div>

          <form @submit.prevent="handleLogin" class="space-y-4">
            <div class="space-y-1">
              <label class="text-[10px] font-black text-(--text-muted) uppercase tracking-widest pl-1">{{ language.translateDynamic('Username') }}</label>
              <input
                v-model="username"
                type="text"
                :placeholder="language.translateDynamic('Username')"
                class="w-full border-2 border-(--border-color) bg-(--card-bg) px-5 py-3 text-sm rounded-xl outline-none focus:border-(--accent-color) transition-all dark:text-white shadow-inner"
                required
              />
            </div>

            <div class="space-y-1">
              <div class="flex justify-between items-center px-1">
                <label class="text-[10px] font-black text-(--text-muted) uppercase tracking-widest">{{ language.translateDynamic('Password') }}</label>
                <a href="#" class="text-[10px] text-(--accent-color) hover:underline font-black">{{ language.translateDynamic('Account Help?') }}</a>
              </div>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="language.translateDynamic('Password')"
                class="w-full border-2 border-(--border-color) bg-(--card-bg) px-5 py-3 text-sm rounded-xl outline-none focus:border-(--accent-color) transition-all dark:text-white shadow-inner"
                required
              />
            </div>

            <button
              type="submit"
              :disabled="auth.isLoading"
              class="w-full bg-(--accent-color) hover:bg-[#1D4ED8] text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-(--accent-color)/20 uppercase text-xs tracking-[0.2em] active:scale-95 disabled:opacity-50"
            >
              {{ auth.isLoading ? language.translateDynamic('Verifying...') : language.translateDynamic('Login') }}
            </button>
          </form>

          <div class="mt-8 pt-8 border-t border-(--border-color)">
            <button
              @click="createDemoAccount"
              class="w-full border-2 border-(--border-color) hover:border-(--accent-color) hover:text-(--accent-color) py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-[0.1em] dark:text-gray-300 shadow-sm"
            >
              {{ language.translateDynamic('Instant Demo Access') }}
            </button>
            
            <p class="text-center text-[10px] text-(--text-muted) font-black mt-8 uppercase tracking-widest">
              {{ language.translateDynamic("Don't have an account?") }} 
              <button @click="router.push('/register')" class="text-(--accent-color) hover:underline">{{ language.translateDynamic('Register Now') }}</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

