<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted, reactive } from 'vue'
import { useChatStore } from '../stores/chatbot'
import { useCurrencyStore } from '../stores/currency'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '../stores/language'

const chat = useChatStore()
const currency = useCurrencyStore()
const language = useLanguageStore()
const router = useRouter()
const input = ref('')
const scrollArea = ref<HTMLElement | null>(null)
const isScrolled = ref(false)

// ── Scroll tracking ──────────────────────────────────────────────
const handleScroll = () => {
  isScrolled.value = (window.pageYOffset || document.documentElement.scrollTop) > 100
}
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

// ── Message sending ──────────────────────────────────────────────
const handleSend = () => {
  if (!input.value.trim() || chat.isTyping) return
  chat.sendMessage(input.value)
  input.value = ''
}

// ── Auto-scroll ──────────────────────────────────────────────────
const scrollToBottom = () => {
  nextTick(() => {
    if (scrollArea.value) {
      scrollArea.value.scrollTop = scrollArea.value.scrollHeight
    }
  })
}
watch(() => chat.messages.length, scrollToBottom)
watch(() => chat.isTyping, scrollToBottom)

// ── Typewriter effect ────────────────────────────────────────────
const displayedText = reactive<Record<number, string>>({})
const typingSet = reactive<Record<number, boolean>>({})

const typeMessage = (id: number, fullText: string) => {
  if (id in typingSet) return
  typingSet[id] = true
  displayedText[id] = ''
  let i = 0
  const interval = setInterval(() => {
    if (i < fullText.length) {
      displayedText[id] += fullText[i++]
      scrollToBottom()
    } else {
      clearInterval(interval)
      delete typingSet[id]
    }
  }, 12)
}

// On first load show everything instantly, on new messages typewrite bot replies
let chatInitialized = false
watch(
  () => chat.messages.length,
  () => {
    chat.messages.forEach(msg => {
      if (msg.id in displayedText) return // already handled
      if (!chatInitialized || msg.role === 'user') {
        displayedText[msg.id] = msg.text  // instant for user + history
      } else {
        typeMessage(msg.id, msg.text)     // typewriter for new bot replies
      }
    })
    chatInitialized = true
  },
  { immediate: true }
)

// ── Navigate to product ──────────────────────────────────────────
const navigateToProduct = (id: number) => {
  router.push(`/product/${id}`)
  chat.isOpen = false
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-[100] font-sans">
    <div class="flex flex-col items-center">
      <!-- Back to Top Button -->
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-10 scale-50"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-10 scale-50"
      >
        <button
          v-if="isScrolled && !chat.isOpen"
          @click="scrollToTop"
          class="w-14 h-14 rounded-full bg-linear-to-br from-[#2563EB] to-[#7C3AED] shadow-[0_10px_40px_rgba(0,0,0,0.3)] text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 border-4 border-white dark:border-gray-800 mb-2"
          title="Back to Top"
        >
          <span class="text-xl font-bold">↑</span>
        </button>
      </transition>

      <!-- Chat Toggle Button -->
      <button
        @click="chat.toggle"
        class="w-16 h-16 rounded-full bg-linear-to-br from-[#2563EB] to-[#7C3AED] shadow-[0_8px_30px_rgb(37,99,235,0.4)] flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 relative border-4 border-white dark:border-gray-800"
      >
        <div v-if="!chat.isOpen" class="animate-ping absolute inset-0 rounded-full bg-blue-400/20"></div>
        <svg v-if="!chat.isOpen" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <svg v-else class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <span v-if="!chat.isOpen" class="text-[10px] font-black uppercase tracking-widest text-[#2563EB] dark:text-blue-400 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm border border-blue-100 dark:border-blue-900/30 mt-1">
        Ask me
      </span>
    </div>

    <!-- Chat Window -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-10 scale-90"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-10 scale-90"
    >
      <div
        v-if="chat.isOpen"
        class="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[560px] bg-white dark:bg-gray-900 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden"
      >
        <!-- Header -->
        <div class="bg-linear-to-r from-[#2563EB] to-[#7C3AED] p-4 text-white shrink-0 relative overflow-hidden">
          <div class="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/5 pointer-events-none"></div>
          <div class="absolute -bottom-6 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none"></div>
          <div class="flex items-center justify-between relative z-10">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner border border-white/30">
                🤖
              </div>
              <div>
                <h3 class="font-black text-base tracking-tight leading-tight">Omaxy AI</h3>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="text-[9px] text-blue-100/90 font-bold uppercase tracking-widest flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                    Online
                  </span>
                  <span
                    :class="chat.isAiEnabled ? 'bg-green-400/20 border-green-400/40 text-green-200' : 'bg-white/10 border-white/20 text-white/70'"
                    class="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border"
                  >
                    {{ chat.isAiEnabled ? 'Gemini AI' : 'Smart Mode' }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <button
                v-if="chat.messages.length > 1"
                @click="chat.clearConversation"
                class="p-2 hover:bg-white/10 rounded-lg transition-colors text-[10px] font-black uppercase tracking-widest opacity-70 hover:opacity-100"
                title="Clear Conversation"
              >
                Clear
              </button>
              <button @click="chat.isOpen = false" class="p-1.5 hover:bg-white/10 rounded-full transition-colors opacity-70 hover:opacity-100" title="Minimize">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Messages Area -->
        <div
          ref="scrollArea"
          class="grow overflow-y-auto p-4 space-y-3 scroll-smooth"
        >
          <div
            v-for="msg in chat.messages"
            :key="msg.id"
            :class="['flex w-full', msg.role === 'user' ? 'justify-end' : 'justify-start']"
          >
            <!-- Bot avatar -->
            <div v-if="msg.role === 'bot'" class="w-7 h-7 rounded-full bg-linear-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-xs mr-2 shrink-0 mt-1">
              🤖
            </div>

            <div
              :class="[
                'max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm',
                msg.role === 'user'
                  ? 'bg-linear-to-br from-[#2563EB] to-[#1D4ED8] text-white rounded-tr-none'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700'
              ]"
            >
              <p class="font-medium leading-relaxed whitespace-pre-wrap text-sm">
                {{ displayedText[msg.id] !== undefined ? displayedText[msg.id] : msg.text }}<span
                  v-if="msg.id in typingSet"
                  class="inline-block w-0.5 h-4 ml-0.5 bg-current animate-pulse align-middle opacity-80"
                ></span>
              </p>

              <!-- Product Cards in Chat -->
              <div v-if="msg.products && msg.products.length > 0" class="mt-3 space-y-2">
                <div
                  v-for="p in msg.products"
                  :key="p.id"
                  @click="navigateToProduct(p.id)"
                  class="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-[#2563EB] hover:shadow-md cursor-pointer transition-all group"
                >
                  <img :src="p.thumbnail" class="w-12 h-12 object-cover rounded-lg bg-white shrink-0" />
                  <div class="min-w-0 grow">
                    <p class="text-xs font-bold truncate">{{ p.title }}</p>
                    <div class="flex items-center gap-2 mt-0.5">
                      <p class="text-xs font-black text-[#2563EB]">{{ currency.format(p.price) }}</p>
                      <span v-if="p.rating" class="text-[10px] text-amber-500 font-bold">⭐ {{ p.rating }}</span>
                    </div>
                  </div>
                  <span class="opacity-0 group-hover:opacity-100 text-[#2563EB] shrink-0 transition-opacity">→</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="chat.isTyping" class="flex justify-start items-end gap-2">
            <div class="w-7 h-7 rounded-full bg-linear-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-xs shrink-0">
              🤖
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div class="flex gap-1.5 items-center">
                <div class="w-2 h-2 bg-[#2563EB] rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-[#2563EB] rounded-full animate-bounce [animation-delay:0.15s]"></div>
                <div class="w-2 h-2 bg-[#2563EB] rounded-full animate-bounce [animation-delay:0.3s]"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shrink-0">
          <div class="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-2xl p-1.5 border border-gray-200 dark:border-gray-700">
            <input
              v-model="input"
              @keyup.enter="handleSend"
              :disabled="chat.isTyping"
              type="text"
              placeholder="Ask me anything..."
              class="grow bg-transparent border-none focus:outline-none px-3 py-2 text-sm text-gray-800 dark:text-gray-200 disabled:opacity-50 placeholder:text-gray-400"
            />
            <button
              @click="handleSend"
              :disabled="chat.isTyping || !input.trim()"
              class="w-9 h-9 rounded-xl bg-linear-to-br from-[#2563EB] to-[#7C3AED] text-white flex items-center justify-center shadow-md transition-all active:scale-90 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
            >
              <svg class="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
          <!-- Quick Actions -->
          <div class="flex flex-wrap gap-1.5 mt-2.5">
            <button
              v-for="action in chat.suggestedActions"
              :key="action.label"
              @click="chat.sendMessage(action.query)"
              :disabled="chat.isTyping"
              class="text-[10px] font-bold px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              {{ action.icon }} {{ action.label }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.scroll-smooth { scroll-behavior: smooth; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.2); border-radius: 10px; }
::-webkit-scrollbar-track { background: transparent; }
</style>
