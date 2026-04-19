<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLanguageStore } from '../stores/language'
import NavBar from '../components/NavBar.vue'

const language = useLanguageStore()

const faqs = computed(() => [
  { q: language.translateDynamic('How do I track my order?'), a: language.translateDynamic('Go to your profile and click "My Orders". Each order shows a real-time tracking status. You\'ll also receive email updates at each stage of delivery.') },
  { q: language.translateDynamic('What is the return policy?'), a: language.translateDynamic('We offer a 15-day hassle-free return policy on most items. The product must be unused, in its original packaging. Initiate returns from your order history.') },
  { q: language.translateDynamic('How long does delivery take?'), a: language.translateDynamic('Standard delivery takes 3–7 business days. Express delivery (available at checkout) delivers within 1–2 business days for most locations.') },
  { q: language.translateDynamic('Can I change or cancel my order?'), a: language.translateDynamic('Yes, you can cancel or modify orders within 1 hour of placing them. After that, please contact our support team for assistance.') },
  { q: language.translateDynamic('What payment methods are accepted?'), a: language.translateDynamic('We accept all major credit/debit cards, PayPal, bank transfers, and OMAX Wallet. Cash on delivery is available in select regions.') },
  { q: language.translateDynamic('How do I contact a seller directly?'), a: language.translateDynamic('On any product page, scroll down to find the "Contact Seller" button. Messages are responded to within 24 hours.') },
])

const openFaq = ref<number | null>(null)
const toggleFaq = (i: number) => { openFaq.value = openFaq.value === i ? null : i }

const contactForm = ref({ name: '', email: '', subject: '', message: '' })
const submitted = ref(false)
const submitting = ref(false)

const submitForm = async () => {
  if (!contactForm.value.name || !contactForm.value.email || !contactForm.value.message) return
  submitting.value = true
  await new Promise(r => setTimeout(r, 1200))
  submitting.value = false
  submitted.value = true
}

const channels = computed(() => [
  { icon: '💬', title: language.translateDynamic('Live Chat'), desc: language.translateDynamic('Chat with a support agent in real time.'), action: language.translateDynamic('Start Chat'), available: true },
  { icon: '📧', title: language.translateDynamic('Email Support'), desc: 'support@omax.store · Reply within 24h', action: language.translateDynamic('Send Email'), available: true },
  { icon: '📞', title: language.translateDynamic('Phone'), desc: '+1 234 567 890 · Mon–Fri, 9am–6pm', action: language.translateDynamic('Call Now'), available: true },
  { icon: '🤖', title: language.translateDynamic('AI Assistant'), desc: language.translateDynamic('Get instant answers 24/7 from our bot.'), action: language.translateDynamic('Ask Bot'), available: true },
])
</script>

<template>
  <NavBar />
  <main class="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)]">

    <!-- Hero -->
    <section class="relative overflow-hidden" style="background: linear-gradient(135deg, #0F172A, #1E293B, #1E3A8A);">
      <div class="absolute inset-0 pointer-events-none opacity-10"
        style="background-image: radial-gradient(circle at 50% 50%, white 1px, transparent 1px); background-size: 40px 40px;"></div>
      <div class="max-w-7xl mx-auto px-4 py-20 text-center relative z-10 text-white">
        <span class="text-xs font-black uppercase tracking-[0.2em] bg-white/15 px-3 py-1 rounded-full mb-4 inline-block">🛎️ {{ language.translateDynamic('Support Center') }}</span>
        <h1 class="text-4xl md:text-6xl font-black mt-5 mb-5 leading-tight">
          {{ language.translateDynamic('How Can We') }}<br/>
          <span class="text-[#F59E0B]">{{ language.translateDynamic('Help You?') }}</span>
        </h1>
        <p class="text-white/70 text-lg max-w-lg mx-auto mb-8">{{ language.translateDynamic('Our team is here 24/7 to make sure your OMAX experience is seamless.') }}</p>
        <!-- Quick search -->
        <div class="max-w-xl mx-auto flex bg-white/10 border border-white/20 rounded-xl overflow-hidden backdrop-blur-sm">
          <input type="text" :placeholder="language.translateDynamic('Search help articles...')" class="flex-grow bg-transparent text-white placeholder:text-white/50 px-5 py-3 focus:outline-none text-sm font-medium" />
          <button class="bg-[var(--accent-color)] px-6 py-3 font-black text-sm text-white hover:opacity-90 transition-opacity">{{ language.translateDynamic('Search') }}</button>
        </div>
      </div>
    </section>

    <!-- Contact Channels -->
    <section class="max-w-7xl mx-auto px-4 py-12">
      <div class="flex items-center gap-4 mb-6">
        <h2 class="text-sm font-black uppercase tracking-widest shrink-0">🛎️ {{ language.translateDynamic('Contact Us') }}</h2>
        <div class="h-px flex-grow bg-[var(--border-color)]"></div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="c in channels" :key="c.title"
          class="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 flex flex-col gap-3 hover:border-[var(--accent-color)] hover:shadow-xl transition-all duration-300 group text-center items-center"
        >
          <span class="text-4xl group-hover:scale-110 transition-transform duration-300">{{ c.icon }}</span>
          <div>
            <h3 class="font-black text-sm mb-1">{{ language.translateDynamic(c.title) }}</h3>
            <p class="text-xs text-[var(--text-muted)] leading-relaxed">{{ language.translateDynamic(c.desc) }}</p>
          </div>
          <button class="mt-auto w-full bg-[var(--accent-color)] text-white font-black text-xs uppercase tracking-widest py-2.5 rounded-xl hover:opacity-90 transition-opacity">
            {{ language.translateDynamic(c.action) }}
          </button>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="bg-[var(--card-bg)] border-y border-[var(--border-color)]">
      <div class="max-w-3xl mx-auto px-4 py-14">
        <div class="flex items-center gap-4 mb-8">
          <h2 class="text-sm font-black uppercase tracking-widest shrink-0">❓ {{ language.translateDynamic('Frequently Asked Questions') }}</h2>
          <div class="h-px flex-grow bg-[var(--border-color)]"></div>
        </div>
        <div class="space-y-3">
          <div
            v-for="(faq, i) in faqs" :key="i"
            class="border border-[var(--border-color)] rounded-2xl overflow-hidden transition-all duration-300"
            :class="openFaq === i ? 'border-[var(--accent-color)] shadow-md' : 'hover:border-[var(--accent-color)]/50'"
          >
            <button
              @click="toggleFaq(i)"
              class="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
            >
              <span class="font-black text-sm">{{ language.translateDynamic(faq.q) }}</span>
              <span class="text-[var(--accent-color)] font-black text-lg shrink-0 transition-transform duration-300"
                :class="openFaq === i ? 'rotate-45' : ''">+</span>
            </button>
            <div v-if="openFaq === i" class="px-5 pb-5">
              <p class="text-sm text-[var(--text-muted)] leading-relaxed border-t border-[var(--border-color)] pt-4">{{ language.translateDynamic(faq.a) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Form -->
    <section class="max-w-3xl mx-auto px-4 py-14">
      <div class="flex items-center gap-4 mb-8">
        <h2 class="text-sm font-black uppercase tracking-widest shrink-0">✉️ {{ language.translateDynamic('Send a Message') }}</h2>
        <div class="h-px flex-grow bg-[var(--border-color)]"></div>
      </div>

      <!-- Success state -->
      <div v-if="submitted" class="bg-[#ECFDF5] border-2 border-[#059669] rounded-2xl p-10 text-center">
        <span class="text-5xl mb-4 block">✅</span>
        <h3 class="font-black text-lg text-[#059669] mb-2">{{ language.translateDynamic('Message Sent!') }}</h3>
        <p class="text-sm text-[var(--text-muted)]">{{ language.translateDynamic('Our support team will get back to you within 24 hours.') }}</p>
        <button @click="submitted = false; contactForm.name=''; contactForm.email=''; contactForm.subject=''; contactForm.message=''"
          class="mt-6 bg-[#059669] text-white font-black text-xs uppercase tracking-widest px-8 py-3 rounded-xl hover:opacity-90 transition-opacity">
          {{ language.translateDynamic('Send Another') }}
        </button>
      </div>

      <form v-else @submit.prevent="submitForm" class="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-8 space-y-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label class="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] block mb-2">{{ language.translateDynamic('Name *') }}</label>
            <input v-model="contactForm.name" type="text" required placeholder="Your full name"
              class="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent-color)] transition-colors" />
          </div>
          <div>
            <label class="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] block mb-2">{{ language.translateDynamic('Email *') }}</label>
            <input v-model="contactForm.email" type="email" required placeholder="you@email.com"
              class="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent-color)] transition-colors" />
          </div>
        </div>
        <div>
          <label class="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] block mb-2">{{ language.translateDynamic('Subject') }}</label>
          <input v-model="contactForm.subject" type="text" placeholder="What's this about?"
            class="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent-color)] transition-colors" />
        </div>
        <div>
          <label class="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] block mb-2">{{ language.translateDynamic('Message *') }}</label>
          <textarea v-model="contactForm.message" required rows="5" placeholder="Describe your issue in detail..."
            class="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent-color)] transition-colors resize-none"></textarea>
        </div>
        <button type="submit"
          class="w-full bg-[var(--accent-color)] text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
          :disabled="submitting"
        >
          <span v-if="submitting" class="animate-spin">⏳</span>
          <span>{{ submitting ? language.translateDynamic('Sending...') : language.translateDynamic('Send Message') }}</span>
        </button>
      </form>
    </section>

  </main>
</template>
