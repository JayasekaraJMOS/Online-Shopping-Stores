<script setup lang="ts">
import NavBar from '../components/NavBar.vue'
import { useLanguageStore } from '../stores/language'
import { computed } from 'vue'

const language = useLanguageStore()

const benefits = computed(() => [
  { icon: '💰', title: language.translateDynamic('Zero Listing Fees'), desc: language.translateDynamic('List your first 100 products for free. No upfront costs, no hidden charges.') },
  { icon: '🌍', title: language.translateDynamic('Reach Millions'), desc: language.translateDynamic("Tap into OMAX's growing customer base across the country.") },
  { icon: '📊', title: language.translateDynamic('Seller Dashboard'), desc: language.translateDynamic('Real-time analytics, inventory management, and revenue tracking in one place.') },
  { icon: '🛡️', title: language.translateDynamic('Seller Protection'), desc: language.translateDynamic('Secure payouts, fraud prevention, and dedicated dispute resolution support.') },
  { icon: '📦', title: language.translateDynamic('Logistics Support'), desc: language.translateDynamic('Integrated shipping partners with discounted rates for OMAX sellers.') },
  { icon: '📣', title: language.translateDynamic('Marketing Tools'), desc: language.translateDynamic('Run voucher campaigns, sponsored listings, and flash sale slots.') },
])

const steps = computed(() => [
  { n: '01', title: language.translateDynamic('Register'), desc: language.translateDynamic('Create your seller account with basic business details in minutes.') },
  { n: '02', title: language.translateDynamic('List Products'), desc: language.translateDynamic('Upload your inventory with photos, descriptions, and pricing.') },
  { n: '03', title: language.translateDynamic('Start Selling'), desc: language.translateDynamic('Go live and start receiving orders from customers nationwide.') },
  { n: '04', title: language.translateDynamic('Get Paid'), desc: language.translateDynamic('Receive weekly automated payouts directly to your bank account.') },
])

const plans = computed(() => [
  { name: language.translateDynamic('Starter'), price: language.translateDynamic('Free'), color: '#059669', perks: [language.translateDynamic('100 free listings'), language.translateDynamic('Basic analytics'), language.translateDynamic('Standard support'), language.translateDynamic('Commission: 8%')] },
  { name: language.translateDynamic('Pro'), price: '$29/mo', color: '#2563EB', perks: [language.translateDynamic('Unlimited listings'), language.translateDynamic('Advanced analytics'), language.translateDynamic('Priority support'), language.translateDynamic('Commission: 5%'), language.translateDynamic('Flash sale access')] },
  { name: language.translateDynamic('Enterprise'), price: language.translateDynamic('Custom'), color: '#7C3AED', perks: [language.translateDynamic('Dedicated manager'), language.translateDynamic('API access'), language.translateDynamic('24/7 support'), language.translateDynamic('Commission: 3%'), language.translateDynamic('Custom storefront')] },
])
</script>

<template>
  <NavBar />
  <main class="min-h-screen bg-(--bg-color) text-(--text-color)">

    <!-- Hero -->
    <section class="relative overflow-hidden" style="background: linear-gradient(135deg, #064E3B, #059669, #10B981);">
      <div class="absolute inset-0 opacity-10 pointer-events-none"
        style="background-image: radial-gradient(circle at 30% 60%, white 1px, transparent 1px); background-size: 35px 35px;"></div>
      <div class="max-w-7xl mx-auto px-4 py-20 text-white text-center relative z-10">
        <span class="text-xs font-black uppercase tracking-[0.2em] bg-white/20 px-3 py-1 rounded-full mb-4 inline-block">🏪 {{ language.translateDynamic('Seller Programme') }}</span>
        <h1 class="text-4xl md:text-6xl font-black mt-5 mb-5 leading-tight">
          {{ language.translateDynamic('Grow Your Business') }}<br/>
          <span class="text-yellow-300">{{ language.translateDynamic('With OMAX') }}</span>
        </h1>
        <p class="text-white/80 text-lg mb-10 max-w-xl mx-auto">{{ language.translateDynamic('Join thousands of sellers already earning on OMAX. Zero setup costs, powerful tools, and millions of waiting customers.') }}</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="bg-white text-[#059669] font-black px-10 py-4 rounded-xl text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-transform">
            {{ language.translateDynamic('Register as Seller') }}
          </button>
          <button class="border-2 border-white text-white font-black px-10 py-4 rounded-xl text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
            {{ language.translateDynamic('Learn More') }} 👇
          </button>
        </div>
        <!-- Stats -->
        <div class="mt-16 grid grid-cols-3 gap-6 max-w-xl mx-auto">
          <div>
            <p class="text-3xl font-black text-yellow-300">50K+</p>
            <p class="text-xs text-white/70 uppercase tracking-widest mt-1">{{ language.translateDynamic('Active Sellers') }}</p>
          </div>
          <div class="border-x border-white/20">
            <p class="text-3xl font-black text-yellow-300">2M+</p>
            <p class="text-xs text-white/70 uppercase tracking-widest mt-1">{{ language.translateDynamic('Customers') }}</p>
          </div>
          <div>
            <p class="text-3xl font-black text-yellow-300">$12M</p>
            <p class="text-xs text-white/70 uppercase tracking-widest mt-1">{{ language.translateDynamic('Paid Out') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="max-w-7xl mx-auto px-4 py-14">
      <div class="flex items-center gap-4 mb-8">
        <h2 class="text-sm font-black uppercase tracking-widest shrink-0">🗺️ {{ language.translateDynamic('How It Works') }}</h2>
        <div class="h-px grow bg-(--border-color)"></div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="step in steps" :key="step.n"
          class="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 relative overflow-hidden hover:shadow-xl transition-all duration-300 group"
        >
          <span class="absolute top-4 right-5 text-6xl font-black text-(--border-color) leading-none select-none">{{ step.n }}</span>
          <div class="relative z-10">
            <h3 class="font-black text-base mb-2 text-(--accent-color) group-hover:underline">{{ language.translateDynamic(step.title) }}</h3>
            <p class="text-xs text-(--text-muted) leading-relaxed">{{ language.translateDynamic(step.desc) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="bg-(--card-bg) border-y border-(--border-color)">
      <div class="max-w-7xl mx-auto px-4 py-14">
        <div class="flex items-center gap-4 mb-8">
          <h2 class="text-sm font-black uppercase tracking-widest shrink-0">✨ {{ language.translateDynamic('Seller Benefits') }}</h2>
          <div class="h-px grow bg-(--border-color)"></div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="b in benefits" :key="b.title"
            class="flex items-start gap-4 p-5 rounded-2xl border border-(--border-color) hover:border-(--accent-color) hover:shadow-md transition-all duration-300 group bg-(--bg-color)"
          >
            <span class="text-3xl group-hover:scale-110 transition-transform duration-300 shrink-0">{{ b.icon }}</span>
            <div>
              <h3 class="font-black text-sm mb-1">{{ language.translateDynamic(b.title) }}</h3>
              <p class="text-xs text-(--text-muted) leading-relaxed">{{ language.translateDynamic(b.desc) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Plans -->
    <section class="max-w-7xl mx-auto px-4 py-14">
      <div class="flex items-center gap-4 mb-8">
        <h2 class="text-sm font-black uppercase tracking-widest shrink-0">💳 {{ language.translateDynamic('Seller Plans') }}</h2>
        <div class="h-px grow bg-(--border-color)"></div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(plan, i) in plans" :key="plan.name"
          class="rounded-2xl border-2 overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
          :style="{ borderColor: plan.color }"
        >
          <div class="px-6 py-5 text-white" :style="{ background: plan.color }">
            <div class="flex items-center justify-between">
              <p class="font-black uppercase tracking-widest text-sm">{{ language.translateDynamic(plan.name) }}</p>
              <span v-if="i === 1" class="text-[10px] font-black bg-yellow-300 text-yellow-900 px-2 py-0.5 rounded-full uppercase">{{ language.translateDynamic('Popular') }}</span>
            </div>
            <p class="text-3xl font-black mt-2">{{ language.translateDynamic(plan.price) }}</p>
          </div>
          <div class="px-6 py-5 bg-(--card-bg)">
            <ul class="space-y-2 mb-6">
              <li v-for="perk in plan.perks" :key="perk" class="flex items-center gap-2 text-xs font-medium">
                <span :style="{ color: plan.color }" class="font-black">✓</span>
                {{ language.translateDynamic(perk) }}
              </li>
            </ul>
            <button
              class="w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:opacity-90"
              :style="{ background: plan.color, color: 'white' }"
            >{{ language.translateDynamic('Get Started') }}</button>
          </div>
        </div>
      </div>
    </section>

  </main>
</template>

