<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useChatStore } from '../stores/chatbot'
import { useCurrencyStore } from '../stores/currency'
import { useRouter } from 'vue-router'

const chat = useChatStore()
const currency = useCurrencyStore()
const router = useRouter()
const input = ref('')
const scrollArea = ref<HTMLElement | null>(null)

const handleSend = () => {
  if (!input.value.trim()) return
  chat.sendMessage(input.value)
  input.value = ''
}

const scrollToBottom = () => {
  nextTick(() => {
    if (scrollArea.value) {
      scrollArea.value.scrollTop = scrollArea.value.scrollHeight
    }
  })
}

watch(() => chat.messages.length, scrollToBottom)
watch(() => chat.isTyping, scrollToBottom)

const navigateToProduct = (id: number) => {
  router.push(`/product/${id}`)
  chat.isOpen = false
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-[100] font-sans">
    <div class="flex flex-col items-center gap-2">
      <button
        @click="chat.toggle"
        class="w-16 h-16 rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] shadow-[0_8px_30px_rgb(37,99,235,0.4)] flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 group relative border-4 border-white dark:border-gray-800"
      >
        <div v-if="!chat.isOpen" class="animate-ping absolute inset-0 rounded-full bg-blue-400/20"></div>
        <svg v-if="!chat.isOpen" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <svg v-else class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <span v-if="!chat.isOpen" class="text-[10px] font-black uppercase tracking-widest text-[#2563EB] dark:text-blue-400 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm border border-blue-100 dark:border-blue-900/30">
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
        class="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[550px] bg-white dark:bg-gray-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden"
      >
        <!-- Header -->
        <div class="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] p-5 text-white shrink-0">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner border border-white/30">
                🤖
              </div>
              <div>
                <h3 class="font-black text-lg tracking-tight">Omaxy AI</h3>
                <p class="text-xs text-blue-100/80 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Smart Assistant
                </p>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <button 
                v-if="chat.messages.length > 1"
                @click="chat.clearConversation"
                class="p-2 hover:bg-white/10 rounded-lg transition-colors text-[10px] font-black uppercase tracking-widest"
                title="Clear Conversation"
              >
                Clear
              </button>
              <button @click="chat.isOpen = false" class="p-1.5 hover:bg-white/10 rounded-full transition-colors" title="Minimize">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Messages Area -->
        <div
          ref="scrollArea"
          class="flex-grow overflow-y-auto p-4 space-y-4 scroll-smooth bg-[var(--bg-color)]/30 backdrop-blur-sm"
        >
          <div
            v-for="msg in chat.messages"
            :key="msg.id"
            :class="['flex w-full', msg.role === 'user' ? 'justify-end' : 'justify-start']"
          >
            <div
              :class="[
                'max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm',
                msg.role === 'user' 
                  ? 'bg-[#2563EB] text-white rounded-tr-none' 
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700'
              ]"
            >
              <p class="font-medium leading-relaxed">{{ msg.text }}</p>
              
              <!-- Product Cards in Chat -->
              <div v-if="msg.products && msg.products.length > 0" class="mt-4 space-y-2">
                <div
                  v-for="p in msg.products"
                  :key="p.id"
                  @click="navigateToProduct(p.id)"
                  class="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-[#2563EB] cursor-pointer transition-all group"
                >
                  <img :src="p.thumbnail" class="w-12 h-12 object-cover rounded-lg bg-white" />
                  <div class="min-w-0">
                    <p class="text-xs font-bold truncate">{{ p.title }}</p>
                    <p class="text-xs font-black text-[#2563EB]">{{ currency.format(p.price) }}</p>
                  </div>
                  <span class="ml-auto opacity-0 group-hover:opacity-100 text-[#2563EB] shrink-0">→</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="chat.isTyping" class="flex justify-start">
            <div class="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 border border-gray-100 dark:border-gray-700">
              <div class="flex gap-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          <div class="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-2xl p-1.5 border border-gray-100 dark:border-gray-700 shadow-inner">
            <input
              v-model="input"
              @keyup.enter="handleSend"
              type="text"
              placeholder="Type your question..."
              class="flex-grow bg-transparent border-none focus:outline-none px-3 py-2 text-sm text-gray-800 dark:text-gray-200"
            />
            <button
              @click="handleSend"
              class="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 hover:opacity-90"
            >
              <svg class="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
          <div class="flex flex-wrap gap-2 mt-4">
            <button 
              @click="chat.sendMessage('Where is my order?')"
              class="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-[#2563EB] hover:text-[#2563EB] transition-all"
            >
              📦 Track Order
            </button>
            <button 
              @click="chat.sendMessage('Show me smartphones')"
              class="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-[#2563EB] hover:text-[#2563EB] transition-all"
            >
              🛍️ View Products
            </button>
            <button 
              @click="chat.sendMessage('How do I return an item?')"
              class="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-[#2563EB] hover:text-[#2563EB] transition-all"
            >
              🔄 Return Item
            </button>
            <button 
              @click="chat.sendMessage('Talk to a human')"
              class="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-purple-200 bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all flex items-center"
            >
              🎧 Talk to Human
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.scroll-smooth {
  scroll-behavior: smooth;
}
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.1);
  border-radius: 10px;
}
</style>
