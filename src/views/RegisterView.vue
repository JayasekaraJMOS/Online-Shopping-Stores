<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import NavBar from '../components/NavBar.vue'

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
    if (!resp.ok) throw new Error('Registration failed. Please try again.')
    const data = await resp.json()

    // dummyjson /users/add is a mock — it returns a fake user but never persists it,
    // so logging in afterwards always fails. Instead, we build the session directly
    // from the form data + the returned id.
    const fakeToken = btoa(`${username.value}:${Date.now()}`)
    const newUser = {
      id: data.id ?? Math.floor(Math.random() * 9000 + 1000),
      username: username.value,
      email: email.value,
      firstName: firstName.value,
      lastName: lastName.value,
      token: fakeToken
    }
    auth.user = newUser
    localStorage.setItem('auth_token', fakeToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    router.push('/')
  } catch (e: any) {
    error.value = e.message || 'Registration error'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[var(--bg-color)] transition-colors duration-500">
    <NavBar />
    
    <div class="flex-grow flex items-center justify-center p-6 text-[var(--text-color)]">
      <div class="w-full max-w-md bg-[var(--card-bg)] border border-[var(--border-color)] rounded-sm shadow-sm overflow-hidden">
        <div class="p-8">
          <div class="text-center mb-10">
            <h1 class="text-4xl font-black text-[var(--text-color)] tracking-tighter uppercase">Sign Up</h1>
            <p class="text-[10px] text-[var(--text-muted)] font-black mt-2 uppercase tracking-[0.2em]">Join the community today</p>
          </div>

          <div v-if="error" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-[10px] font-black uppercase rounded-xl shadow-sm animate-fade-in text-center">
            ⚠️ {{ error }}
          </div>

          <form @submit.prevent="handleRegister" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest pl-1">First Name</label>
                <input
                  v-model="firstName"
                  type="text"
                  placeholder="John"
                  class="w-full border-2 border-[var(--border-color)] bg-[var(--card-bg)] px-5 py-3 text-sm rounded-xl outline-none focus:border-[var(--accent-color)] transition-all dark:text-white shadow-inner"
                  required
                />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest pl-1">Last Name</label>
                <input
                  v-model="lastName"
                  type="text"
                  placeholder="Doe"
                  class="w-full border-2 border-[var(--border-color)] bg-[var(--card-bg)] px-5 py-3 text-sm rounded-xl outline-none focus:border-[var(--accent-color)] transition-all dark:text-white shadow-inner"
                  required
                />
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest pl-1">Username</label>
              <input
                v-model="username"
                type="text"
                placeholder="johndoe123"
                class="w-full border-2 border-[var(--border-color)] bg-[var(--card-bg)] px-5 py-3 text-sm rounded-xl outline-none focus:border-[var(--accent-color)] transition-all dark:text-white shadow-inner"
                required
              />
            </div>

            <div class="space-y-1">
              <label class="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest pl-1">Email</label>
              <input
                v-model="email"
                type="email"
                placeholder="john@example.com"
                class="w-full border-2 border-[var(--border-color)] bg-[var(--card-bg)] px-5 py-3 text-sm rounded-xl outline-none focus:border-[var(--accent-color)] transition-all dark:text-white shadow-inner"
                required
              />
            </div>

            <div class="space-y-1">
              <label class="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest pl-1">Password</label>
              <input
                v-model="password"
                type="password"
                placeholder="••••••••"
                class="w-full border-2 border-[var(--border-color)] bg-[var(--card-bg)] px-5 py-3 text-sm rounded-xl outline-none focus:border-[var(--accent-color)] transition-all dark:text-white shadow-inner"
                required
              />
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-[var(--accent-color)] hover:bg-[#1D4ED8] text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-[var(--accent-color)]/20 uppercase text-xs tracking-[0.2em] active:scale-95 disabled:opacity-50 mt-4"
            >
              {{ isLoading ? 'Creating...' : 'Sign Up' }}
            </button>
          </form>

          <div class="mt-10 pt-8 border-t border-[var(--border-color)] text-center">
            <p class="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest">
              Already have an account? 
              <button @click="router.push('/login')" class="text-[var(--accent-color)] hover:underline">Login Here</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
